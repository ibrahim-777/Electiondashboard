import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { BarChart3, Plus, Vote, PenSquare, Users, UserCheck, LogOut, Car, FileText, ListChecks, ClipboardCheck, Settings } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { useAuth } from './context/auth-context';
import logoImage from 'figma:asset/0fc7eb6146d69b3e4c9199422d7b4c464e50056a.png';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, hasPermission, currentUser } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l shadow-lg flex-shrink-0 flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          {/* Logo/Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <img 
                src={logoImage} 
                alt="مجموعة حجر وبشر" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">نظام الانتخابات</h1>
                <p className="text-xs text-muted-foreground">البرلمانية 2026</p>
              </div>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="mb-6 pb-6 border-b">
            {currentUser && (
              <div className="mb-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.role}</p>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full bg-[#0d5963] hover:bg-[#0a474f] text-white border-[#0d5963]"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              تسجيل الخروج
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {hasPermission('dashboard') && (
              <Link to="/">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">لوحة النتائج</span>
                </div>
              </Link>
            )}

            {hasPermission('counting-results') && (
              <Link to="/counting-results">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/counting-results'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <ClipboardCheck className="w-5 h-5" />
                  <span className="font-medium">نتائج الفرز</span>
                </div>
              </Link>
            )}

            {hasPermission('voters') && (
              <Link to="/voters">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/voters'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">متابعة الإقتراع</span>
                </div>
              </Link>
            )}

            {hasPermission('edit') && (
              <Link to="/edit">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/edit'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <PenSquare className="w-5 h-5" />
                  <span className="font-medium">إدخال الأصوات</span>
                </div>
              </Link>
            )}

            {hasPermission('manage') && (
              <Link to="/manage">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/manage'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">إدارة القوائم</span>
                </div>
              </Link>
            )}

            {hasPermission('mandubin') && (
              <Link to="/mandubin">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/mandubin'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span className="font-medium">إدارة المندوبين</span>
                </div>
              </Link>
            )}

            {hasPermission('mandubin-tracking') && (
              <Link to="/mandubin-tracking">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/mandubin-tracking'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">متابعة المندوبين</span>
                </div>
              </Link>
            )}

            {hasPermission('cars') && (
              <Link to="/cars">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/cars'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  <span className="font-medium">إدارة السيارات</span>
                </div>
              </Link>
            )}

            {hasPermission('voter-data') && (
              <Link to="/voter-data">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/voter-data'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">بيانات الناخبين</span>
                </div>
              </Link>
            )}

            {hasPermission('green-list') && (
              <Link to="/green-list">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/green-list'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <ListChecks className="w-5 h-5" />
                  <span className="font-medium">القائمة الخضراء</span>
                </div>
              </Link>
            )}

            {hasPermission('accounts') && (
              <Link to="/accounts">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === '/accounts'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">إدارة الحسابات</span>
                </div>
              </Link>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-center" dir="rtl" />
    </div>
  );
}