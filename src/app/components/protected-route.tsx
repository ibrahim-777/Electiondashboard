import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/auth-context';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const { hasPermission, availablePages } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show toast if user tried to access unauthorized page
    if (isAuthenticated && requiredPermission && !hasPermission(requiredPermission)) {
      toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة', {
        description: 'سيتم إعادتك إلى الصفحة الرئيسية',
        duration: 3000,
      });
    }
  }, [location.pathname, isAuthenticated, requiredPermission, hasPermission]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has permission for this specific page
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Get the first page the user has permission to access
    const firstAvailablePage = availablePages.find(page => hasPermission(page.id));
    
    // Redirect to first available page or dashboard
    return <Navigate to={firstAvailablePage?.path || '/'} replace />;
  }

  return <>{children}</>;
}