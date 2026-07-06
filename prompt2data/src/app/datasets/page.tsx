// app/datasets/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/component/layout/Sidebar";
import Navbar from "@/component/layout/Navbar";
import { 
  Search, 
  Copy, 
  CheckCheck, 
  Calendar,
  Database,
  Activity,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const datasets = [
    {
      id: "1",
      query: "Generate B2B SaaS customer data with industry trends",
      subtitle: "500 rows • 12 fields • JSON format",
      date: "2024-01-15",
      rows: 500,
      status: "completed",
      apiKey: "sk_live_4x8k2m9p1q7r3s5t",
    },
    {
      id: "2",
      query: "Synthetic healthcare claims dataset with HIPAA compliance",
      subtitle: "1,200 rows • 8 fields • CSV format",
      date: "2024-01-14",
      rows: 1200,
      status: "completed",
      apiKey: "sk_live_7h4j9k2l5m8n1p6q",
    },
    {
      id: "3",
      query: "E-commerce transaction logs with customer segmentation",
      subtitle: "750 rows • 15 fields • Parquet format",
      date: "2024-01-13",
      rows: 750,
      status: "processing",
      apiKey: "sk_live_2w3e4r5t6y7u8i9o",
    },
    {
      id: "4",
      query: "Financial market data with time-series patterns",
      subtitle: "2,000 rows • 10 fields • JSON format",
      date: "2024-01-12",
      rows: 2000,
      status: "completed",
      apiKey: "sk_live_9i8u7y6t5r4e3w2q",
    },
    {
      id: "5",
      query: "Customer support ticket classification dataset",
      subtitle: "300 rows • 6 fields • CSV format",
      date: "2024-01-11",
      rows: 300,
      status: "completed",
      apiKey: "sk_live_1a2s3d4f5g6h7j8k",
    },
  ];

  const stats = [
    {
      title: "Total Synthetic Rows",
      value: "34,250",
      icon: Database,
      trend: "+12.5%",
    },
    {
      title: "API Requests (24h)",
      value: "1,423",
      icon: Activity,
      trend: "+8.2%",
    },
    {
      title: "Storage Used",
      value: "2.8 GB",
      icon: HardDrive,
      trend: "+2.1 GB",
    },
  ];

  const handleCopy = (apiKey: string, id: string) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskApiKey = (key: string) => {
    return `${key.slice(0, 10)}${'•'.repeat(8)}${key.slice(-4)}`;
  };

  return (
    <div className="flex h-screen text-white bg-[#0B0F19] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
              
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
                  Generated Datasets
                </h1>
                
                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search datasets..."
                    className="w-full bg-[#111827] border border-[#1F2937] text-white text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-[#4B5563]"
                  />
                </div>
              </div>

              {/* Dataset Table */}
              <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-lg shadow-black/10 mb-6">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#1F2937] bg-[#0B0F19]/50">
                  <div className="col-span-5">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Dataset Query
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Date
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Rows
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Status
                    </span>
                  </div>
                  <div className="col-span-3">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      API Key
                    </span>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-[#1F2937]">
                  {datasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#1F2937]/30 transition-all duration-200 items-center"
                    >
                      {/* Dataset Query */}
                      <div className="col-span-5">
                        <p className="text-sm font-medium text-white mb-0.5 line-clamp-1">
                          {dataset.query}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {dataset.subtitle}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#4B5563]" />
                          <span className="text-sm text-[#9CA3AF]">
                            {new Date(dataset.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Rows */}
                      <div className="col-span-1">
                        <span className="text-sm font-semibold text-white">
                          {dataset.rows.toLocaleString()}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <StatusBadge status={dataset.status} />
                      </div>

                      {/* API Key */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-[#9CA3AF] font-mono bg-[#0B0F19] px-2 py-1 rounded border border-[#1F2937]">
                            {maskApiKey(dataset.apiKey)}
                          </code>
                          <button
                            onClick={() => handleCopy(dataset.apiKey, dataset.id)}
                            className="p-1.5 rounded-lg hover:bg-[#374151] transition-all duration-200 group"
                            title="Copy API Key"
                          >
                            {copiedId === dataset.id ? (
                              <CheckCheck className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-white transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-2 mb-8">
                <button className="p-2 rounded-lg border border-[#1F2937] hover:bg-[#1F2937] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4 text-[#9CA3AF]" />
                </button>
                
                <PageButton page={1} active={currentPage === 1} onClick={() => setCurrentPage(1)} />
                <PageButton page={2} active={currentPage === 2} onClick={() => setCurrentPage(2)} />
                <PageButton page={3} active={currentPage === 3} onClick={() => setCurrentPage(3)} />
                
                <button className="p-2 rounded-lg border border-[#1F2937] hover:bg-[#1F2937] transition-all duration-200">
                  <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                </button>
                
                <PageButton page={8} onClick={() => setCurrentPage(8)} />
                
                <button className="p-2 rounded-lg border border-[#1F2937] hover:bg-[#1F2937] transition-all duration-200">
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
                </button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10 hover:border-[#374151] transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <p className="text-sm text-[#9CA3AF] font-medium">
                          {stat.title}
                        </p>
                        <div className="p-2 bg-[#0B0F19] rounded-lg border border-[#1F2937]">
                          <Icon className="w-4 h-4 text-[#6B7280]" />
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <p className="text-3xl font-semibold text-white tracking-tight">
                          {stat.value}
                        </p>
                        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const style = styles[status as keyof typeof styles] || styles.completed;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      {status === 'completed' && '✓ '}
      {status === 'processing' && '⟳ '}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PageButton({ 
  page, 
  active = false, 
  onClick 
}: { 
  page: number; 
  active?: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
          : "text-[#9CA3AF] border border-[#1F2937] hover:bg-[#1F2937] hover:text-white"
      }`}
    >
      {page}
    </button>
  );
}