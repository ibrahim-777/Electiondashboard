import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Dashboard } from "./pages/dashboard";
import { ManageLists } from "./pages/manage-lists";
import { VoteEntry } from "./pages/vote-entry";
import { VoterTracking } from "./pages/voter-tracking";
import { Mandubin } from "./pages/mandubin";
import { MandubinTracking } from "./pages/mandubin-tracking";
import { Cars } from "./pages/cars";
import { Voters } from "./pages/voters";
import { GreenList } from "./pages/green-list";
import { Results } from "./pages/results";
import { Accounts } from "./pages/accounts";
import { Login } from "./pages/login";
import { PrintData } from "./pages/print-data";
import { NotFound } from "./pages/not-found";
import { Layout } from "./layout";
import { ProtectedRoute } from './components/protected-route';

// Protected layout component that checks authentication
function ProtectedLayout() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout />;
}

export function createRouter() {
  return createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <ProtectedLayout />,
      children: [
        { 
          index: true, 
          element: (
            <ProtectedRoute requiredPermission="dashboard">
              <Dashboard />
            </ProtectedRoute>
          )
        },
        { 
          path: "manage", 
          element: (
            <ProtectedRoute requiredPermission="manage">
              <ManageLists />
            </ProtectedRoute>
          )
        },
        { 
          path: "edit", 
          element: (
            <ProtectedRoute requiredPermission="edit">
              <VoteEntry />
            </ProtectedRoute>
          )
        },
        { 
          path: "voters", 
          element: (
            <ProtectedRoute requiredPermission="voters">
              <VoterTracking />
            </ProtectedRoute>
          )
        },
        { 
          path: "voter-data", 
          element: (
            <ProtectedRoute requiredPermission="voter-data">
              <Voters />
            </ProtectedRoute>
          )
        },
        { 
          path: "mandubin", 
          element: (
            <ProtectedRoute requiredPermission="mandubin">
              <Mandubin />
            </ProtectedRoute>
          )
        },
        { 
          path: "mandubin-tracking", 
          element: (
            <ProtectedRoute requiredPermission="mandubin-tracking">
              <MandubinTracking />
            </ProtectedRoute>
          )
        },
        { 
          path: "cars", 
          element: (
            <ProtectedRoute requiredPermission="cars">
              <Cars />
            </ProtectedRoute>
          )
        },
        { 
          path: "green-list", 
          element: (
            <ProtectedRoute requiredPermission="green-list">
              <GreenList />
            </ProtectedRoute>
          )
        },
        { 
          path: "results", 
          element: (
            <ProtectedRoute requiredPermission="results">
              <Results />
            </ProtectedRoute>
          )
        },
        { 
          path: "accounts", 
          element: (
            <ProtectedRoute requiredPermission="accounts">
              <Accounts />
            </ProtectedRoute>
          )
        },
        { 
          path: "print", 
          element: (
            <ProtectedRoute requiredPermission="print">
              <PrintData />
            </ProtectedRoute>
          )
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
}