import { RouterProvider } from 'react-router';
import { createRouter } from './routes';
import { AuthProvider } from './context/auth-context';
import { ElectionProvider } from './context/election-context';
import { useMemo } from 'react';

function AppContent() {
  const router = useMemo(() => createRouter(), []);
  
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ElectionProvider>
        <AppContent />
      </ElectionProvider>
    </AuthProvider>
  );
}