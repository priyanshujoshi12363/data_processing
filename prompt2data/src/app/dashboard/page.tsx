"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiUploadCloud,
  FiSend,
  FiFile,
  FiX,
  FiDownload,
  FiCpu,
  FiCheckCircle,
  FiLogOut,
  FiZap,
  FiPlus,
} from "react-icons/fi";
import { getFreshToken, logout } from "@/lib/auth";
import { useAuthUser } from "@/lib/useAuthUser";

const ACCEPT = ".csv,.tsv,.json,.jsonl,.txt,.xlsx";
const VALID = ["csv", "tsv", "json", "jsonl", "txt", "xlsx"];
const EXAMPLES = [
  "Fix spelling and capitalize all city names properly",
  "Remove emojis and normalize phone numbers to +1 format",
  "Standardize the country column to ISO codes and trim whitespace",
  "Deduplicate rows and fix inconsistent date formats",
];
const STAGES = [
  "Parsing your file…",
  "Understanding your prompt…",
  "Cleaning rows with gpt-oss…",
  "Fixing typos & formatting…",
  "Removing duplicates & empty rows…",
  "Finalizing your clean file…",
];

interface Stats {
  totalRows: number;
  cleanedRows: number;
  duplicatesRemoved: number;
  nullRowsRemoved: number;
  cellsImputed?: number;
  duplicatesFlagged?: number;
}
interface Preview {
  columns: string[];
  rows: string[][];
}
interface Message {
  id: number;
  role: "user" | "assistant";
  text?: string;
  fileName?: string;
  status?: "thinking" | "done" | "error";
  stats?: Stats;
  preview?: Preview;
  downloadUrl?: string;
  downloadName?: string;
}

function splitLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (const c of line) {
    if (c === '"') q = !q;
    else if (c === delim && !q) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function buildPreview(text: string, format: string): Preview | undefined {
  try {
    if (format === "json") {
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : [data];
      const columns = Object.keys(arr[0] ?? {});
      return {
        columns,
        rows: arr.slice(0, 6).map((r) => columns.map((c) => String(r[c] ?? ""))),
      };
    }
    if (format === "jsonl") {
      const arr = text
        .split(/\r?\n/)
        .filter(Boolean)
        .slice(0, 6)
        .map((l) => JSON.parse(l));
      const columns = Object.keys(arr[0] ?? {});
      return { columns, rows: arr.map((r) => columns.map((c) => String(r[c] ?? ""))) };
    }
    const delim = format === "tsv" ? "\t" : ",";
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) return undefined;
    const columns = splitLine(lines[0], delim);
    const rows = lines.slice(1, 7).map((l) => splitLine(l, delim));
    return { columns, rows };
  } catch {
    return undefined;
  }
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, setCredits } = useAuthUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [estRows, setEstRows] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!busy) return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [busy]);

  const pickFile = useCallback((f: File | null) => {
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!VALID.includes(ext)) return;
    setFile(f);
    setEstRows(null);

    if (["csv", "tsv", "txt", "jsonl"].includes(ext) && f.size < 8_000_000) {
      f.text()
        .then((t) => {
          const lines = t.split(/\r?\n/).filter((l) => l.trim()).length;
          setEstRows(ext === "csv" || ext === "tsv" ? Math.max(0, lines - 1) : lines);
        })
        .catch(() => setEstRows(null));
    }
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      pickFile(e.dataTransfer.files?.[0] ?? null);
    },
    [pickFile]
  );

  const clearFile = () => {
    setFile(null);
    setEstRows(null);
  };

  const growTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const send = async () => {
    if (!file || busy) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: prompt.trim() || "Clean this dataset.",
      fileName: file.name,
    };
    const thinkingId = Date.now() + 1;
    setMessages((m) => [
      ...m,
      userMsg,
      { id: thinkingId, role: "assistant", status: "thinking" },
    ]);

    const sentFile = file;
    const sentPrompt = prompt.trim();
    clearFile();
    setPrompt("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setBusy(true);

    try {
      const token = await getFreshToken();
      const fd = new FormData();
      fd.append("file", sentFile);
      fd.append("prompt", sentPrompt);

      const res = await fetch("/api/clean", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        let msg = "Cleaning failed. Please try again.";
        try {
          const j = await res.json();
          if (j?.detail?.error)
            msg = `${j.detail.error} — need ${j.detail.required}, you have ${j.detail.available}.`;
          else if (typeof j?.detail === "string") msg = j.detail;
          else if (j?.error) msg = j.error;
        } catch {}
        setMessages((m) =>
          m.map((x) => (x.id === thinkingId ? { ...x, status: "error", text: msg } : x))
        );
        return;
      }

      const stats: Stats | undefined = (() => {
        try {
          return JSON.parse(res.headers.get("x-clean-stats") || "");
        } catch {
          return undefined;
        }
      })();
      const detected = res.headers.get("x-detected-format") || "csv";
      const remaining = res.headers.get("x-credits-remaining");
      const cd = res.headers.get("content-disposition") || "";
      const nameMatch = cd.match(/filename="?([^"]+)"?/);
      const downloadName = nameMatch?.[1] || `cleaned.${sentFile.name.split(".").pop()}`;

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);

      let preview: Preview | undefined;
      if (detected !== "xlsx") {
        const previewFormat = ["json", "jsonl", "tsv"].includes(detected) ? detected : "csv";
        preview = buildPreview(await blob.text(), previewFormat);
      }

      if (remaining != null) setCredits(Number(remaining));

      setMessages((m) =>
        m.map((x) =>
          x.id === thinkingId
            ? { ...x, status: "done", stats, preview, downloadUrl, downloadName }
            : x
        )
      );
    } catch {
      setMessages((m) =>
        m.map((x) =>
          x.id === thinkingId
            ? { ...x, status: "error", text: "Network error. The cleaning service may be waking up — try again in a moment." }
            : x
        )
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-white">
        <div className="h-9 w-9 animate-spin-slow rounded-full border-[3px] border-brand-100 border-t-brand" />
      </div>
    );
  }

  const cost = estRows != null ? Math.max(1, Math.ceil(estRows / 10)) : null;

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-50">
      {/* topbar */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white/90 px-3 backdrop-blur sm:h-16 sm:px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">
            P2
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight sm:block">
            Prompt<span className="text-brand">2</span>Data
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="hidden items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-ash transition-colors hover:border-gray-300 hover:text-ink sm:inline-flex"
            >
              <FiPlus size={14} /> New
            </button>
          )}
          <div className="flex items-center gap-1.5 rounded-full border border-grass-100 bg-grass-50 px-2.5 py-1.5 text-sm font-semibold text-grass sm:px-3">
            <FiZap size={14} />
            {user.credits ?? 0}
            <span className="hidden text-xs font-normal text-grass-600 sm:inline">credits</span>
          </div>
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.picture} alt="" className="h-8 w-8 rounded-full" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </span>
          )}
          <button
            onClick={logout}
            className="rounded-lg p-2 text-ash transition-colors hover:bg-gray-100 hover:text-ink"
            title="Log out"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </header>

      {/* chat area */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
        <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-64" />
        <div className="relative mx-auto max-w-3xl px-3 py-6 sm:px-4">
          {messages.length === 0 ? (
            <EmptyState onExample={(e) => setPrompt(e)} />
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {messages.map((m) =>
                m.role === "user" ? (
                  <UserBubble key={m.id} msg={m} />
                ) : (
                  <AssistantBubble key={m.id} msg={m} elapsed={elapsed} />
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* composer */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-4">
        <div className="mx-auto max-w-3xl">
          {file && (
            <div className="animate-msg-in mb-2.5 flex items-center justify-between gap-2 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2 text-sm text-brand-700">
                <FiFile size={16} className="flex-shrink-0" />
                <span className="truncate font-medium">{file.name}</span>
                <span className="hidden flex-shrink-0 text-xs text-brand sm:inline">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                {cost != null && (
                  <span className="flex-shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-brand">
                    ~{cost} credit{cost === 1 ? "" : "s"} · {estRows} rows
                  </span>
                )}
              </div>
              <button onClick={clearFile} className="flex-shrink-0 text-brand hover:text-brand-700">
                <FiX size={16} />
              </button>
            </div>
          )}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex items-end gap-2 rounded-2xl border bg-white p-2 shadow-sm transition-colors ${
              dragOver ? "border-brand bg-brand-50" : "border-gray-200"
            }`}
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 text-ash transition-colors hover:border-brand hover:text-brand"
              title="Attach a file"
            >
              <FiUploadCloud size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />

            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                growTextarea();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={
                file ? "Describe how to clean it…" : "Attach a file, then describe how to clean it…"
              }
              className="max-h-40 min-w-0 flex-1 resize-none bg-transparent px-1 py-2.5 text-sm text-ink outline-none placeholder:text-ash sm:px-2"
            />

            <button
              onClick={send}
              disabled={!file || busy}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-all hover:bg-brand-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              title="Clean"
            >
              {busy ? (
                <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <FiSend size={16} />
              )}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-ash">
            <span className="hidden sm:inline">Drag &amp; drop · </span>
            CSV, Excel, JSON, JSONL, TSV, TXT · processed in memory, never stored
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onExample }: { onExample: (e: string) => void }) {
  return (
    <div className="animate-fade-up flex flex-col items-center pt-8 text-center sm:pt-12">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white shadow-lg shadow-gray-300">
        <FiCpu size={26} />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">Clean your dataset</h1>
      <p className="mt-2 max-w-md text-sm text-ash">
        Attach a file, tell the agent how you want it cleaned, and get a clean file
        back. Try one of these to start:
      </p>
      <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
        {EXAMPLES.map((e, i) => (
          <button
            key={e}
            onClick={() => onExample(e)}
            style={{ animationDelay: `${i * 80}ms` }}
            className="animate-fade-up rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-ink transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

function UserBubble({ msg }: { msg: Message }) {
  return (
    <div className="animate-msg-in flex flex-col items-end gap-1.5">
      {msg.fileName && (
        <div className="flex max-w-[85%] items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-ash">
          <FiFile size={13} className="flex-shrink-0" />
          <span className="truncate">{msg.fileName}</span>
        </div>
      )}
      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-4 py-2.5 text-sm text-white">
        {msg.text}
      </div>
    </div>
  );
}

function AssistantBubble({ msg, elapsed }: { msg: Message; elapsed: number }) {
  const stage = STAGES[Math.min(Math.floor(elapsed / 3), STAGES.length - 1)];

  return (
    <div className="animate-msg-in flex items-start gap-2.5">
      <span
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          msg.status === "error" ? "bg-red-50 text-red-500" : "bg-grass-50 text-grass"
        }`}
      >
        <FiCpu size={15} />
      </span>

      <div className="min-w-0 max-w-[88%] flex-1 sm:max-w-[85%]">
        {msg.status === "thinking" && (
          <div className="w-full max-w-sm rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
              <span className="text-sm font-medium text-ink">{stage}</span>
              <span className="ml-auto text-xs tabular-nums text-ash">{elapsed}s</span>
            </div>
            <div className="progress-track mt-3 h-1.5">
              <span className="progress-bar" />
            </div>
          </div>
        )}

        {msg.status === "error" && (
          <div className="rounded-2xl rounded-bl-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {msg.text}
          </div>
        )}

        {msg.status === "done" && (
          <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-grass">
              <FiCheckCircle size={16} /> Cleaning complete
            </div>

            {msg.stats && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Stat label="Rows in" value={msg.stats.totalRows} />
                <Stat label="Rows out" value={msg.stats.cleanedRows} tone="grass" />
                <Stat label="Duplicates removed" value={msg.stats.duplicatesRemoved} />
                <Stat label="Values imputed" value={msg.stats.cellsImputed ?? 0} tone="grass" />
                <Stat label="Duplicates flagged" value={msg.stats.duplicatesFlagged ?? 0} />
                <Stat label="Empty rows" value={msg.stats.nullRowsRemoved} />
              </div>
            )}

            {msg.preview && msg.preview.columns.length > 0 && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-ash">
                    <tr>
                      {msg.preview.columns.slice(0, 6).map((c, i) => (
                        <th key={i} className="whitespace-nowrap px-3 py-2 font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {msg.preview.rows.map((r, ri) => (
                      <tr key={ri} className="transition-colors hover:bg-gray-50">
                        {r.slice(0, 6).map((cell, ci) => (
                          <td key={ci} className="max-w-[180px] truncate whitespace-nowrap px-3 py-2 text-ink">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {msg.downloadUrl && (
              <a
                href={msg.downloadUrl}
                download={msg.downloadName}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-95"
              >
                <FiDownload size={15} /> Download
                <span className="hidden max-w-[160px] truncate sm:inline">{msg.downloadName}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: number;
  tone?: "ink" | "grass";
}) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2.5">
      <div className={`text-lg font-bold ${tone === "grass" ? "text-grass" : "text-ink"}`}>
        {value}
      </div>
      <div className="text-[11px] text-ash">{label}</div>
    </div>
  );
}
