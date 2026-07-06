// app/api-docs/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/component/layout/Sidebar";
import Navbar from "@/component/layout/Navbar";
import { 
  Copy, 
  CheckCheck, 
  ExternalLink,
  Key,
  BookOpen,
  Clock,
  FileText,
  ChevronRight,
  Terminal,
  Zap,
  Shield,
  Code2
} from "lucide-react";
import Link from "next/link";

export default function APIDocsPage() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const apiKey = "sk_live_4x8k2m9p1q7r3s5t";
  const maskedKey = "sk_live_••••••••••••••••••••";

  const handleCopy = (type: 'key' | 'install' | 'code') => {
    if (type === 'key') {
      navigator.clipboard.writeText(apiKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === 'install') {
      navigator.clipboard.writeText("pip install dataverse-architect");
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } else {
      const code = `from dataverse import Client

client = Client(api_key="${apiKey}")

data = client.generate(
    prompt="startup data",
    rows=500
)`;
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const resources = [
    { 
      label: "Postman Collection", 
      href: "#",
      icon: FileText 
    },
    { 
      label: "Rate Limits", 
      href: "#",
      icon: Clock 
    },
    { 
      label: "Changelog", 
      href: "#",
      icon: BookOpen 
    },
  ];

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
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Developer Portal
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                  Architecting Reality<br />
                  via Data APIs
                </h1>
                
                <p className="text-lg text-[#9CA3AF] max-w-3xl leading-relaxed">
                  Generate high-fidelity synthetic datasets programmatically with our 
                  enterprise-grade API. Built for scale, designed for precision.
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Utility Cards */}
                <div className="space-y-6">
                  
                  {/* Authentication Card */}
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-[#0B0F19] rounded-lg border border-[#1F2937]">
                        <Key className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                        Authentication
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-[#6B7280] uppercase tracking-wider block mb-1.5">
                          Live API Key
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm text-[#9CA3AF] font-mono bg-[#0B0F19] px-3 py-2 rounded-lg border border-[#1F2937]">
                            {maskedKey}
                          </code>
                          <button
                            onClick={() => handleCopy('key')}
                            className="p-2 rounded-lg bg-[#0B0F19] border border-[#1F2937] hover:bg-[#1F2937] transition-all duration-200 group"
                          >
                            {copiedKey ? (
                              <CheckCheck className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 pt-2">
                        <Shield className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-[#6B7280] leading-relaxed">
                          Never share your secret key in public code or client-side applications.
                          Use environment variables in production.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resources Card */}
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-[#0B0F19] rounded-lg border border-[#1F2937]">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                        Resources
                      </h3>
                    </div>
                    
                    <div className="space-y-1">
                      {resources.map((resource, index) => {
                        const Icon = resource.icon;
                        return (
                          <Link
                            key={index}
                            href={resource.href}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1F2937] transition-all duration-200 group"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors" />
                              <span className="text-sm text-[#E5E7EB] group-hover:text-white transition-colors">
                                {resource.label}
                              </span>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-[#4B5563] group-hover:text-[#6B7280] transition-colors" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Links Card */}
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-lg shadow-black/10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-[#0B0F19] rounded-lg border border-[#1F2937]">
                        <Zap className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                        Quick Links
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Link
                        href="#"
                        className="flex items-center justify-between text-sm text-[#9CA3AF] hover:text-white transition-colors group"
                      >
                        <span>SDK Reference</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href="#"
                        className="flex items-center justify-between text-sm text-[#9CA3AF] hover:text-white transition-colors group"
                      >
                        <span>API Status</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href="#"
                        className="flex items-center justify-between text-sm text-[#9CA3AF] hover:text-white transition-colors group"
                      >
                        <span>Migration Guide</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Column - Documentation */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Python Quickstart */}
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 lg:p-8 shadow-lg shadow-black/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">
                          Python Quickstart
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-[#0B0F19] border border-[#1F2937] rounded-lg text-xs font-medium text-[#9CA3AF]">
                          v2.4.0
                        </span>
                        <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-medium text-blue-400">
                          Recommended
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
                      Get started with the Dataverse Architect SDK in under 2 minutes. 
                      Generate production-ready synthetic datasets with a few lines of code.
                    </p>

                    {/* Install Command */}
                    <div className="mb-6">
                      <label className="text-xs text-[#6B7280] uppercase tracking-wider block mb-2">
                        Installation
                      </label>
                      <div className="relative">
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <button
                            onClick={() => handleCopy('install')}
                            className="p-1.5 rounded-md hover:bg-[#1F2937] transition-all duration-200 group"
                          >
                            {copiedInstall ? (
                              <CheckCheck className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors" />
                            )}
                          </button>
                        </div>
                        <CodeBlock>
                          pip install dataverse-architect
                        </CodeBlock>
                      </div>
                    </div>

                    {/* Initialize Client */}
                    <div>
                      <label className="text-xs text-[#6B7280] uppercase tracking-wider block mb-2">
                        Initialize Client
                      </label>
                      <div className="relative">
                        <div className="absolute right-3 top-3">
                          <button
                            onClick={() => handleCopy('code')}
                            className="p-1.5 rounded-md hover:bg-[#1F2937] transition-all duration-200 group"
                          >
                            {copiedCode ? (
                              <CheckCheck className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors" />
                            )}
                          </button>
                        </div>
                        <CodeBlock>
{`from dataverse import Client

client = Client(api_key="${apiKey}")

data = client.generate(
    prompt="startup data",
    rows=500
)`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>

                  {/* Response Parameters */}
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 lg:p-8 shadow-lg shadow-black/10">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Response Parameters
                    </h3>
                    
                    <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
                      The <code className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-xs">client.generate()</code> method 
                      returns a structured dataset object with the following properties:
                    </p>

                    <div className="space-y-4">
                      <ParameterRow 
                        name="data" 
                        type="array" 
                        description="Array of generated records matching your schema"
                      />
                      <ParameterRow 
                        name="metadata" 
                        type="object" 
                        description="Generation statistics, timestamps, and schema info"
                      />
                      <ParameterRow 
                        name="usage" 
                        type="object" 
                        description="Credit consumption and rate limit information"
                      />
                      <ParameterRow 
                        name="id" 
                        type="string" 
                        description="Unique identifier for the generated dataset"
                      />
                    </div>

                    {/* Example Response */}
                    <div className="mt-6 pt-6 border-t border-[#1F2937]">
                      <label className="text-xs text-[#6B7280] uppercase tracking-wider block mb-2">
                        Example Response
                      </label>
                      <CodeBlock>
{`{
  "data": [
    { "id": 1, "company": "TechCorp", "valuation": "$2.4B" },
    { "id": 2, "company": "DataFlow", "valuation": "$890M" }
  ],
  "metadata": {
    "total_rows": 500,
    "generated_at": "2024-01-15T10:30:00Z",
    "schema_version": "2.4.0"
  },
  "usage": {
    "credits_used": 1000,
    "remaining": 1400
  },
  "id": "ds_4x8k2m9p1q7r3s5t"
}`}
                      </CodeBlock>
                    </div>
                  </div>

                  {/* Additional Endpoints */}
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 lg:p-8 shadow-lg shadow-black/10">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Additional Endpoints
                    </h3>
                    
                    <div className="space-y-3">
                      <EndpointRow 
                        method="GET"
                        path="/v1/datasets"
                        description="List all generated datasets"
                      />
                      <EndpointRow 
                        method="GET"
                        path="/v1/datasets/:id"
                        description="Retrieve a specific dataset"
                      />
                      <EndpointRow 
                        method="POST"
                        path="/v1/datasets/:id/export"
                        description="Export dataset to CSV/JSON/Parquet"
                      />
                      <EndpointRow 
                        method="DELETE"
                        path="/v1/datasets/:id"
                        description="Delete a dataset"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-[#020617] border border-[#1F2937] rounded-xl p-4 overflow-x-auto">
      <code className="text-sm text-[#E5E7EB] font-mono leading-relaxed">
        {children}
      </code>
    </pre>
  );
}

function ParameterRow({ name, type, description }: { name: string; type: string; description: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#1F2937] last:border-0">
      <div className="min-w-[120px]">
        <code className="text-sm text-blue-400 font-mono">{name}</code>
        <span className="ml-2 text-xs text-[#4B5563] font-mono">{type}</span>
      </div>
      <p className="text-sm text-[#9CA3AF] leading-relaxed">{description}</p>
    </div>
  );
}

function EndpointRow({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColors = {
    GET: "text-green-400 bg-green-500/10 border-green-500/20",
    POST: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    DELETE: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const color = methodColors[method as keyof typeof methodColors] || methodColors.GET;

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1F2937]/50 transition-all duration-200 group">
      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${color} min-w-[60px] text-center`}>
        {method}
      </span>
      <code className="text-sm text-[#E5E7EB] font-mono group-hover:text-white transition-colors">
        {path}
      </code>
      <span className="text-xs text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors ml-auto">
        {description}
      </span>
    </div>
  );
}