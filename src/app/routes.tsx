import { createBrowserRouter, Navigate } from "react-router";
import { Dashboard } from "./pages/dashboard";
import { ManageLists } from "./pages/manage-lists";
import { VoteEntry } from "./pages/vote-entry";
import { VoterTracking } from "./pages/voter-tracking";
import { Mandubin } from "./pages/mandubin";
import { MandubinTracking } from "./pages/mandubin-tracking";
import { Cars } from "./pages/cars";
import { Voters } from "./pages/voters";
import { GreenList } from "./pages/green-list";
import { CountingResults } from "./pages/counting-results";
import { Accounts } from "./pages/accounts";
import { Login } from "./pages/login";
import { PrintData } from "./pages/print-data";
import { Layout } from "./layout";
import { ElectionProvider, useElection } from './context/election-context';
import { AuthProvider } from './context/auth-context';

// Loading component
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">جاري تحميل البيانات...</p>
      </div>
    </div>
  );
}

// Root component with providers
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ElectionProvider>
        <DataLoader>{children}</DataLoader>
      </ElectionProvider>
    </AuthProvider>
  );
}

// Data loader component that shows loading state
function DataLoader({ children }: { children: React.ReactNode }) {
  const { loading } = useElection();

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

// Protected layout component that checks authentication
function ProtectedLayout() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <RootLayout>
      <Layout />
    </RootLayout>
  );
}

// Login wrapper with providers
function LoginWrapper() {
  return (
    <RootLayout>
      <Login />
    </RootLayout>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginWrapper,
  },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      { 
        index: true, 
        Component: Dashboard 
      },
      { 
        path: "manage", 
        Component: ManageLists 
      },
      { 
        path: "edit", 
        Component: VoteEntry 
      },
      { 
        path: "voters", 
        Component: VoterTracking 
      },
      { 
        path: "voter-data", 
        Component: Voters 
      },
      { 
        path: "mandubin", 
        Component: Mandubin 
      },
      { 
        path: "mandubin-tracking", 
        Component: MandubinTracking 
      },
      { 
        path: "cars", 
        Component: Cars 
      },
      { 
        path: "green-list", 
        Component: GreenList 
      },
      { 
        path: "counting-results", 
        Component: CountingResults 
      },
      { 
        path: "accounts", 
        Component: Accounts 
      },
      { 
        path: "print", 
        Component: PrintData 
      },
    ],
  },
]);