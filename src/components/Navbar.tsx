import React, { useState } from 'react';
import { 
  Activity, 
  FileText, 
  Calendar, 
  Sparkles, 
  LayoutDashboard, 
  Plus, 
  User as UserIcon, 
  LogOut, 
  Upload, 
  Heart,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, SystemScoreBreakdown } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any | null;
  profile: UserProfile | null;
  scoreBreakdown: SystemScoreBreakdown;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenAddReading: () => void;
  onOpenUploadLab: () => void;
  onOpenDailyLog: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  profile,
  scoreBreakdown,
  onOpenAuth,
  onOpenProfile,
  onOpenAddReading,
  onOpenUploadLab,
  onOpenDailyLog,
  onLogout
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'biomarkers', label: 'Biomarkers', icon: Activity },
    { id: 'lab_vault', label: 'Lab Documents', icon: FileText },
    { id: 'daily_log', label: 'Daily Bio-Log', icon: Calendar },
    { id: 'advisor', label: 'Balance Insights', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 text-left group focus:outline-none"
              id="bio-balance-logo-button"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white/20 stroke-white stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 font-heading">
                    BIO BALANCE
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-teal-100 text-teal-800">
                    Pro
                  </span>
                </div>
                <p className="text-xs text-slate-700 hidden sm:block font-medium">Biomarker & Longevity Intelligence</p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-slate-100 text-teal-800 shadow-xs' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-slate-600'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Section */}
          <div className="flex items-center gap-3">
            
            {/* Bio Balance Score Badge */}
            <div 
              onClick={() => setActiveTab('dashboard')} 
              className={`cursor-pointer hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-tight shadow-2xs transition-transform hover:scale-102 ${getScoreColor(scoreBreakdown.overall)}`}
              title="Current Aggregate Bio Balance Index"
            >
              <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span>Bio Balance: {scoreBreakdown.overall}/100</span>
            </div>

            {/* Quick Action Dropdown */}
            <div className="relative">
              <button
                id="btn-quick-log-menu"
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Record</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {showQuickMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setShowQuickMenu(false)}
                >
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onOpenAddReading();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left font-medium"
                    id="menu-log-biomarker"
                  >
                    <Activity className="w-4 h-4 text-teal-700" />
                    <div>
                      <div className="font-semibold text-slate-800">Add Biomarker Reading</div>
                      <div className="text-xs text-slate-600">Glucose, Lipids, Hormones...</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onOpenUploadLab();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left font-medium"
                    id="menu-upload-lab"
                  >
                    <Upload className="w-4 h-4 text-indigo-700" />
                    <div>
                      <div className="font-semibold text-slate-800">Upload Lab File</div>
                      <div className="text-xs text-slate-600">PDF, image, or lab export</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onOpenDailyLog();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left font-medium"
                    id="menu-daily-checkin"
                  >
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="font-semibold text-slate-800">Daily Bio-Checkin</div>
                      <div className="text-xs text-slate-600">Sleep, Hydration, Recovery</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 hidden md:block max-w-[120px] truncate">
                    {profile?.displayName || user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                </button>

                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-600">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email || 'Demo Profile'}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-700 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Private & Encrypted Storage</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left font-medium"
                      id="menu-settings-btn"
                    >
                      <UserIcon className="w-4 h-4 text-slate-600" />
                      <span>Profile & Health Targets</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 text-left font-medium border-t border-slate-100 mt-1"
                      id="menu-logout-btn"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-sign-in-nav"
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-100 -mx-4 px-4 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
