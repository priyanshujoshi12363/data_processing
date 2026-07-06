// src/app/(app)/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Key, 
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  Calendar,
  CreditCard,
  Zap
} from "lucide-react";
import Sidebar from "@/component/layout/Sidebar";
import Navbar from "@/component/layout/Navbar";
import { authFetch, logout, getFreshToken } from "@/lib/auth";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await authFetch("/api/auth/getUser");

      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      const token = await getFreshToken();
      
      if (!token) {
        logout();
        return;
      }
      
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        logout();
        router.push("/login");
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (userData?.email) {
      return userData.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen text-white bg-[#0B0F19] overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[#9CA3AF] text-sm">Loading settings...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen text-white bg-[#0B0F19] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6 lg:p-8 max-w-6xl mx-auto">
              
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-semibold text-white tracking-tight mb-2">
                  Settings
                </h1>
                <p className="text-[#9CA3AF] text-sm">
                  View and manage your account settings
                </p>
              </div>

              <div className="flex border-b border-[#1F2937] mb-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                        activeTab === tab.id
                          ? "text-blue-400 border-blue-500"
                          : "text-[#9CA3AF] border-transparent hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 lg:p-8 shadow-lg shadow-black/10">
                
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>
                    
                    <div className="flex items-center gap-6 pb-6 border-b border-[#1F2937]">
                      <div className="relative">
                        {userData?.image ? (
                          <img 
                            src={userData.image} 
                            alt={userData.name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-medium">
                            {getUserInitials()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium mb-1">
                          {userData?.name || "User"}
                        </p>
                        <p className="text-xs text-[#6B7280]">{userData?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem label="Full Name" value={userData?.name || "Not set"} />
                      <InfoItem label="Email Address" value={userData?.email || "Not set"} />
                      <InfoItem label="Plan" value={userData?.plan || "Free"} />
                      <InfoItem 
                        label="Credits" 
                        value={userData?.credits || 0} 
                        icon={<Zap className="w-4 h-4 text-blue-400" />}
                      />
                      <InfoItem 
                        label="Member Since" 
                        value={formatDate(userData?.createdAt)} 
                        icon={<Calendar className="w-4 h-4 text-blue-400" />}
                      />
                      <InfoItem 
                        label="Last Login" 
                        value={formatDate(userData?.lastLogin)} 
                        icon={<Calendar className="w-4 h-4 text-blue-400" />}
                      />
                    </div>

                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-white font-medium mb-1">Account Status</p>
                          <p className="text-xs text-[#9CA3AF]">
                            Your account is {userData?.isActive ? "active" : "inactive"} and in good standing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Security Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                        <div className="flex items-start gap-3">
                          <Smartphone className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-white mb-1">Two-Factor Authentication</p>
                            <p className="text-xs text-[#6B7280]">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <span className="text-xs text-yellow-400">Coming Soon</span>
                        </div>
                      </div>

                      <div className="p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-white mb-1">Login Method</p>
                            <p className="text-xs text-[#6B7280]">
                              You're signed in with {userData?.provider === 'google' ? 'Google' : userData?.provider === 'github' ? 'GitHub' : 'Email'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-white mb-1">Active Sessions</p>
                            <p className="text-xs text-[#6B7280]">Manage your active login sessions</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <span className="text-xs text-yellow-400">Coming Soon</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Notification Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-white mb-1">Email Notifications</p>
                            <p className="text-xs text-[#6B7280]">Receive email updates about your account activity</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <span className="text-xs text-green-400">Enabled</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                        <div className="flex items-start gap-3">
                          <Bell className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-white mb-1">Push Notifications</p>
                            <p className="text-xs text-[#6B7280]">Get real-time alerts in your browser</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <span className="text-xs text-yellow-400">Coming Soon</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-white mb-1">Usage Alerts</p>
                            <p className="text-xs text-[#6B7280]">Get notified when approaching credit limits</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <span className="text-xs text-green-400">Enabled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "api" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-white">API Keys</h2>
                      <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <span className="text-xs text-yellow-400">Coming Soon</span>
                      </div>
                    </div>
                    
                    <div className="p-8 text-center bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                      <Key className="w-12 h-12 text-[#4B5563] mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-[#9CA3AF]">API key management coming soon</p>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Regional Preferences</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem label="Timezone" value="Eastern Time (ET)" />
                      <InfoItem label="Language" value="English" />
                    </div>

                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <p className="text-xs text-[#9CA3AF]">
                        <span className="text-blue-400 font-medium">Note:</span> More preference options coming soon.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 bg-[#111827] border border-red-500/20 rounded-2xl p-6 lg:p-8">
                <h3 className="text-red-400 font-semibold mb-2">Danger Zone</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 transition-all duration-200"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          
          <div className="relative bg-[#111827] border border-[#1F2937] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                <p className="text-sm text-[#9CA3AF]">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-[#E5E7EB] mb-6">
              Are you sure you want to delete your account? All your data, datasets, and credits will be permanently removed.
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-[#1F2937] text-[#E5E7EB] text-sm font-medium rounded-xl hover:bg-[#1F2937] transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Yes, Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="bg-[#0B0F19] border border-[#1F2937] rounded-xl p-4">
      <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-white text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}