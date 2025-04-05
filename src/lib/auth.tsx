"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter, usePathname } from "next/navigation";

// Define the shape of the auth context
interface AuthContextType {
  isAuthenticated: boolean;
  address: string | undefined;
  isLoading: boolean;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  address: undefined,
  isLoading: true,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// List of public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/api", "/api/fetch-account"];

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to ensure wallet connection is properly detected
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if the current route is protected and user is not authenticated
    if (!isLoading && !isConnected) {
      const isPublicRoute = PUBLIC_ROUTES.some(route => {
        // Check exact match or if it's a subpath of a public route with trailing slash
        return pathname === route || pathname.startsWith(`${route}/`);
      });

      if (!isPublicRoute) {
        router.push("/");
      }
    }
  }, [isConnected, isLoading, pathname, router]);

  // The value to be provided to the context consumers
  const value = {
    isAuthenticated: isConnected,
    address,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Higher Order Component to protect routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const ProtectedRoute: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if ((!isLoading && !isAuthenticated)) {
        router.push("/");
      }
    }, [isAuthenticated, isLoading, router]);

    // Show nothing while checking authentication
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // If not authenticated, this will redirect, but we still need to return something
    if (!isAuthenticated) {
      return <div className="flex justify-center items-center h-screen">Redirecting...</div>;
    }

    // If authenticated, render the protected component
    return <Component {...props} />;
  };

  return ProtectedRoute;
} 