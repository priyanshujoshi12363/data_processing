"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/component/layout/Sidebar";
import Navbar from "@/component/layout/Navbar";
import { 
  Zap, 
  Clock, 
  Database, 
  ChevronDown,
  FileJson,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, onAuthStateChanged, User } from "firebase/auth";

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [structureMode, setStructureMode] = useState<"auto" | "custom">("auto");
  const [rows, setRows] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [mode, setMode] = useState<string>("");
  const [jobId, setJobId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [customSchema, setCustomSchema] = useState<any>({
    name: "string",
    industry: "string"
  });

  const costPerRow = 2;
  const totalCost = rows * costPerRow;
  const remainingCredits = 2400;

  // 🔐 Handle Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login. Please try again.");
    }
  };

  // Generate dataset function with API integration
  const handleGenerate = async () => {
    if (!user) {
      setError("Please login first");
      return;
    }

    if (totalCost > remainingCredits) {
      setError("Insufficient credits. Please upgrade.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError("");
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // 🔐 Get Firebase token and send to backend
      const token = await user.getIdToken();
      
      const response = await fetch("/api/datasets/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: prompt,
          schema: structureMode === "custom" ? customSchema : null,
          rows: rows,
          format: "json"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate dataset");
      }

      const data = await response.json();
      
      setMode(data.mode);
      setJobId(data.jobId);
      setPreviewData(data.preview);
      setProgress(100);
      
      console.log(`Dataset generated in ${data.mode} mode with ID: ${data.datasetId}`);
      
    } catch (error: any) {
      console.error("Generation error:", error);
      setError(error.message || "Failed to generate dataset");
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  // Preview button handler
  const handlePreview = async () => {
    if (!user) {
      setError("Please login first");
      return;
    }

    if (!prompt) {
      setError("Please enter a prompt first");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const token = await user.getIdToken();
      
      const response = await fetch("/api/datasets/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: prompt,
          schema: structureMode === "custom" ? customSchema : null,
          rows: Math.min(rows, 10),
          format: "json"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get preview");
      }

      const data = await response.json();
      setPreviewData(data.preview);
      setMode(data.mode);
      setJobId(data.jobId);
      
    } catch (error: any) {
      console.error("Preview error:", error);
      setError(error.message || "Failed to get preview");
    } finally {
      setIsGenerating(false);
    }
  };

 
  return (
    <div className="flex h-screen text-white bg-[#0B0F19]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
                <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-300">
                  ×
                </button>
              </div>
            )}
            
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
                Generator Workspace
              </h1>
              <p className="text-[#9CA3AF] text-sm mt-1">
                Design precision datasets with architect-level controls
              </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* LEFT COLUMN - Main Controls */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Prompt Section */}
                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Requirement Prompt
                    </label>
                    <span className="text-[10px] text-[#4B5563]">
                      {prompt.length} chars
                    </span>
                  </div>
                  
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the dataset you want... (e.g., 'Indian startups')"
                    className="w-full h-36 bg-[#0B0F19] border border-[#1F2937] text-white text-sm rounded-xl p-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-[#4B5563] resize-none"
                  />
                  
                  <div className="mt-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#6B7280]" />
                    <p className="text-xs text-[#6B7280]">
                      Try: "Generate 500 synthetic customer profiles for a B2B SaaS company" or "Indian startups"
                    </p>
                  </div>
                </div>

                {/* Structure + Slider Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Structure Section */}
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10">
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3 block">
                      Structure
                    </label>
                    
                    {/* Toggle */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setStructureMode("auto")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          structureMode === "auto"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-[#0B0F19] text-[#9CA3AF] border border-[#1F2937] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Auto Generate</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setStructureMode("custom")}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          structureMode === "custom"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-[#0B0F19] text-[#9CA3AF] border border-[#1F2937] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <FileJson className="w-3.5 h-3.5" />
                          <span>Custom JSON</span>
                        </div>
                      </button>
                    </div>
                    
                    {/* JSON Preview / Editor */}
                    <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-4">
                      {structureMode === "auto" ? (
                        <pre className="font-mono text-xs text-[#9CA3AF]">
                          <code>
{`{
  "fields": [
    { "name": "name", "type": "string" },
    { "name": "industry", "type": "string" }
  ]
}`}
                          </code>
                        </pre>
                      ) : (
                        <textarea
                          value={JSON.stringify(customSchema, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setCustomSchema(parsed);
                            } catch (err) {
                              // Invalid JSON, ignore
                            }
                          }}
                          className="w-full h-32 bg-transparent text-[#9CA3AF] font-mono text-xs focus:outline-none resize-none"
                          placeholder='{"name": "string", "industry": "string"}'
                        />
                      )}
                    </div>
                  </div>

                  {/* Dataset Scale Section */}
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10">
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3 block">
                      Dataset Scale
                    </label>
                    
                    {/* Slider */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#9CA3AF]">Rows to generate</span>
                        <span className="text-lg font-semibold text-white">{rows}</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={rows}
                        onChange={(e) => setRows(parseInt(e.target.value))}
                        className="w-full h-2 bg-[#0B0F19] rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-[#4B5563]">10</span>
                        <span className="text-xs text-[#4B5563]">1000</span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="space-y-3 pt-2 border-t border-[#1F2937]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#9CA3AF]">Cost estimate</span>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-sm font-medium text-white">{totalCost}</span>
                          <span className="text-xs text-[#6B7280]">credits</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#9CA3AF]">Remaining credits</span>
                        <span className="text-sm font-medium text-white">{remainingCredits}</span>
                      </div>
                      
                      {totalCost > remainingCredits && (
                        <div className="flex items-center gap-2 text-amber-500 text-xs bg-amber-500/10 p-2 rounded-lg">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Insufficient credits. Upgrade to continue.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleGenerate}
                    disabled={totalCost > remainingCredits || isGenerating || !prompt}
                    className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 disabled:bg-[#1F2937] disabled:text-[#6B7280] disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Dataset</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePreview}
                    disabled={isGenerating || !prompt}
                    className="flex-1 md:flex-none border border-[#1F2937] hover:border-[#374151] hover:bg-[#1F2937] text-[#E5E7EB] px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Preview Data
                  </button>
                </div>

                {/* Mode and Job ID Display */}
                {mode && (
                  <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#9CA3AF]">Mode:</span>
                      <span className="text-blue-400 font-medium">{mode}</span>
                      {jobId && (
                        <>
                          <span className="text-[#9CA3AF]">Job ID:</span>
                          <span className="text-[#9CA3AF] font-mono text-xs">{jobId}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN - Live Feedback & Preview */}
              <div className="space-y-6">
                
                {/* Live Process Card */}
                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Live Process
                    </label>
                    {isGenerating && (
                      <span className="flex items-center gap-1.5 text-xs text-blue-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Active
                      </span>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-semibold text-white">{progress}%</span>
                      <span className="text-sm text-[#9CA3AF]">
                        {progress === 100 ? 'Complete' : 'Processing'}
                      </span>
                    </div>
                    <div className="h-2 bg-[#0B0F19] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1F2937]">
                    <div>
                      <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Time remaining</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {isGenerating ? '~45s' : '--'}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 text-[#6B7280] text-xs mb-1">
                        <Database className="w-3.5 h-3.5" />
                        <span>Records</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {previewData.length > 0 ? previewData.length : 0}
                        <span className="text-sm text-[#6B7280] ml-1">/ {rows}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sampling Terminal - Shows Preview Data */}
                <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10">
                  <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4 block">
                    Preview Data {previewData.length > 0 && `(${previewData.length} rows)`}
                  </label>
                  
                  {previewData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#1F2937]">
                            {Object.keys(previewData[0]).map((key) => (
                              <th key={key} className="text-left py-2 px-3 text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.slice(0, 10).map((row, idx) => (
                            <tr key={idx} className="border-b border-[#1F2937] last:border-0 hover:bg-[#1F2937]/50 transition-colors">
                              {Object.values(row).map((value: any, valIdx) => (
                                <td key={valIdx} className="py-2.5 px-3 text-[#9CA3AF] text-xs">
                                  {value === null ? "—" : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6B7280] text-sm">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No preview data yet</p>
                      <p className="text-xs mt-1">Enter a prompt and click Preview Data</p>
                    </div>
                  )}
                  
                  {/* Footer */}
                  {previewData.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between">
                      <span className="text-xs text-[#6B7280]">
                        Showing {Math.min(previewData.length, 10)} of {previewData.length} rows
                      </span>
                      <button
                        onClick={handlePreview}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <span>Refresh Preview</span>
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}