// component/layout/Sidebar.tsx
"use client";

import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronDown,
  User,
  Plus,
  Receipt
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserInfo, logout, onAuthChange } from "@/lib/auth";

export default function Sidebar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Load initial user info
    const info = getUserInfo();
    setUserInfo(info);

    // Listen to auth changes
    const unsubscribe = onAuthChange((user) => {
      setUserInfo(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Database, label: "Datasets", href: "/datasets", badge: "12" },
    { icon: FileText, label: "API & Docs", href: "/api-docs" },
  ];

  const accountItems = [
    { icon: CreditCard, label: "Billing & Plans", href: "/billing" },
    { icon: Receipt, label: "Invoices", href: "/invoices" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const getUserInitials = () => {
    if (userInfo?.name) {
      return userInfo.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (userInfo?.email) {
      return userInfo.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (userInfo?.name) {
      return userInfo.name;
    }
    if (userInfo?.email) {
      return userInfo.email.split('@')[0];
    }
    return "User";
  };

  return (
    <aside className="w-72 bg-[#0B0F19] border-r border-[#1F2937] flex flex-col h-screen sticky top-0">
      
      {/* Logo Section */}
      <div className="p-5 border-b border-[#1F2937]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Image 
              src="/image1.png" 
              alt="Prompt2Data" 
              width={36} 
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg tracking-tight">
              prompt2data
            </h1>
            <p className="text-[10px] text-[#6B7280] font-medium tracking-wide">
              THE LOGICAL ARCHITECT
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider px-3 mb-3">
          Platform
        </p>
        
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <NavItem 
              icon={<item.icon size={18} />} 
              label={item.label} 
              badge={item.badge}
              active={pathname === item.href}
            />
          </Link>
        ))}
        
        <div className="my-6 border-t border-[#1F2937]"></div>
        
        <p className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider px-3 mb-3">
          Account
        </p>
        
        {accountItems.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <NavItem 
              icon={<item.icon size={18} />} 
              label={item.label}
              active={pathname === item.href}
            />
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#1F2937] space-y-3">
        
        {/* Generate New Button */}
        <Link href="/generate">
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Generate New</span>
            <Sparkles className="w-3.5 h-3.5 opacity-70" />
          </button>
        </Link>

        {/* Upgrade Banner - Only show for free users */}
        {userInfo?.plan === 'free' && (
          <Link href="/billing">
            <div className="bg-gradient-to-br from-[#1F2937] to-[#111827] border border-[#374151] rounded-xl p-4 relative overflow-hidden cursor-pointer hover:border-blue-500/30 transition-all duration-200 group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/20 transition-all duration-200" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-blue-400" />
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Pro Features
                  </span>
                </div>
                
                <p className="text-white text-sm font-medium mb-1">
                  Unlock unlimited datasets
                </p>
                <p className="text-[#9CA3AF] text-xs mb-3">
                  Advanced analytics & priority support
                </p>
                
                <div className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-center">
                  Upgrade to Pro
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#1F2937] transition-all duration-200 group"
          >
            {userInfo?.picture ? (
              <img 
                src={userInfo.picture} 
                alt={getDisplayName()}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-[#1F2937]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                {getUserInitials()}
              </div>
            )}
            
            <div className="flex-1 text-left min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {getDisplayName()}
              </p>
              <p className="text-[#6B7280] text-xs truncate">
                {userInfo?.email || 'Loading...'}
              </p>
            </div>
            
            <ChevronDown 
              size={16} 
              className={`text-[#6B7280] transition-transform duration-200 flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setUserMenuOpen(false)}
              />
              
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200 z-50">
                <Link href="/settings" onClick={() => setUserMenuOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-colors">
                    <Settings size={14} />
                    <span>Settings</span>
                  </button>
                </Link>
                
                <Link href="/billing" onClick={() => setUserMenuOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E5E7EB] hover:bg-[#374151] transition-colors">
                    <CreditCard size={14} />
                    <span>Billing</span>
                  </button>
                </Link>
                
                <div className="border-t border-[#374151] my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavItem({ 
  icon, 
  label, 
  badge = null, 
  active = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  badge?: string | null;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
        active
          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          : "text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#E5E7EB]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-blue-400' : 'text-[#6B7280] group-hover:text-[#9CA3AF]'} transition-colors`}>
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      
      {badge && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          active 
            ? 'bg-blue-500 text-white' 
            : 'bg-[#374151] text-[#9CA3AF] group-hover:bg-[#4B5563] group-hover:text-[#E5E7EB]'
        } transition-colors`}>
          {badge}
        </span>
      )}
    </div>
  );
}