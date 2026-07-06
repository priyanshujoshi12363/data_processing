// src/app/(app)/invoices/page.tsx
"use client";

import { 
  Download, 
  Eye, 
  Filter,
  Search,
  Calendar,
  CreditCard,
  ChevronDown,
  FileText
} from "lucide-react";
import { useState } from "react";
import Sidebar from "@/component/layout/Sidebar";
import Navbar from "@/component/layout/Navbar";
import Link from "next/link";

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const invoices = [
    {
      id: "INV-2024-001",
      date: "Jan 15, 2024",
      amount: "$29.00",
      status: "Paid",
      plan: "Pro Plan",
      billingPeriod: "Jan 15 - Feb 14, 2024",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-012",
      date: "Dec 15, 2023",
      amount: "$29.00",
      status: "Paid",
      plan: "Pro Plan",
      billingPeriod: "Dec 15 - Jan 14, 2024",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-011",
      date: "Nov 15, 2023",
      amount: "$29.00",
      status: "Paid",
      plan: "Pro Plan",
      billingPeriod: "Nov 15 - Dec 14, 2023",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-010",
      date: "Oct 15, 2023",
      amount: "$29.00",
      status: "Paid",
      plan: "Pro Plan",
      billingPeriod: "Oct 15 - Nov 14, 2023",
      downloadUrl: "#",
    },
    {
      id: "INV-2023-009",
      date: "Sep 15, 2023",
      amount: "$29.00",
      status: "Paid",
      plan: "Pro Plan",
      billingPeriod: "Sep 15 - Oct 14, 2023",
      downloadUrl: "#",
    },
  ];

  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpent = invoices.reduce((sum, inv) => {
    const amount = parseFloat(inv.amount.replace('$', ''));
    return sum + amount;
  }, 0);

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
              
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight">
                        Invoices
                      </h1>
                      <p className="text-[#9CA3AF] text-sm mt-0.5">
                        View and download your billing invoices
                      </p>
                    </div>
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-[#6B7280] uppercase tracking-wider">Total Invoices</p>
                      <p className="text-lg font-semibold text-white">{invoices.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#6B7280] uppercase tracking-wider">Total Spent</p>
                      <p className="text-lg font-semibold text-white">${totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by invoice number or plan..."
                    className="w-full bg-[#111827] border border-[#1F2937] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-[#4B5563]"
                  />
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="px-4 py-2.5 bg-[#111827] border border-[#1F2937] text-[#E5E7EB] text-sm rounded-xl hover:bg-[#1F2937] transition-all duration-200 flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {filterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#111827] border border-[#1F2937] rounded-xl shadow-xl overflow-hidden z-10">
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 text-sm text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-colors">
                          All Invoices
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-colors">
                          This Month
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-colors">
                          Last 3 Months
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-[#E5E7EB] hover:bg-[#1F2937] rounded-lg transition-colors">
                          This Year
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button className="px-4 py-2.5 bg-[#111827] border border-[#1F2937] text-[#E5E7EB] text-sm rounded-xl hover:bg-[#1F2937] transition-all duration-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date Range</span>
                </button>
              </div>

              {/* Invoices Table */}
              <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-lg shadow-black/10">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1F2937] bg-[#0B0F19]/50">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Invoice
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Period
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-right py-4 px-6 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
                          <tr 
                            key={invoice.id} 
                            className={`border-b border-[#1F2937] last:border-0 transition-colors ${
                              selectedInvoice === invoice.id 
                                ? 'bg-blue-500/10' 
                                : 'hover:bg-[#1F2937]/30'
                            }`}
                            onClick={() => setSelectedInvoice(invoice.id)}
                          >
                            <td className="py-4 px-6">
                              <span className="text-sm font-mono text-white">{invoice.id}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm text-[#9CA3AF]">{invoice.date}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm text-white">{invoice.plan}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm text-[#9CA3AF]">{invoice.billingPeriod}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-medium text-white">{invoice.amount}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                {invoice.status}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/invoices/${invoice.id}`}>
                                  <button className="p-2 rounded-lg hover:bg-[#374151] transition-all duration-200 group">
                                    <Eye className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors" />
                                  </button>
                                </Link>
                                <button className="p-2 rounded-lg hover:bg-[#374151] transition-all duration-200 group">
                                  <Download className="w-4 h-4 text-[#6B7280] group-hover:text-white transition-colors" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center">
                            <FileText className="w-12 h-12 text-[#374151] mx-auto mb-3" />
                            <p className="text-[#9CA3AF] text-sm">No invoices found</p>
                            <p className="text-[#6B7280] text-xs mt-1">Try adjusting your search or filters</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="border-t border-[#1F2937] px-6 py-4 bg-[#0B0F19]/30">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#6B7280]">
                      Showing {filteredInvoices.length} of {invoices.length} invoices
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg">
                        1
                      </button>
                      <button className="px-3 py-1.5 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors">
                        2
                      </button>
                      <button className="px-3 py-1.5 text-xs text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/billing">
                  <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-xl hover:border-blue-500/30 hover:bg-[#1F2937]/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          Manage Billing
                        </p>
                        <p className="text-xs text-[#6B7280]">Update payment methods and plans</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <button className="p-4 bg-[#111827] border border-[#1F2937] rounded-xl hover:border-blue-500/30 hover:bg-[#1F2937]/50 transition-all duration-200 group text-left">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        Export All
                      </p>
                      <p className="text-xs text-[#6B7280]">Download invoice history as CSV</p>
                    </div>
                  </div>
                </button>
                
                <Link href="/api-docs">
                  <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-xl hover:border-blue-500/30 hover:bg-[#1F2937]/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          API Usage
                        </p>
                        <p className="text-xs text-[#6B7280]">View API consumption and billing</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}