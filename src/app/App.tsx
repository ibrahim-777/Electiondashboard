import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ElectionProvider } from './context/election-context';
import { AuthProvider } from './context/auth-context';

export default function App() {
  return (
    <AuthProvider>
      <ElectionProvider>
        <RouterProvider router={router} />
      </ElectionProvider>
    </AuthProvider>
  );
}