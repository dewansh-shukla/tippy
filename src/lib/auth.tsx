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

// Storage key for last authenticated path
const LAST_PATH_KEY = "lastAuthenticatedPath";

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [wasConnected, setWasConnected] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Effect to track connection state changes
  useEffect(() => {
    if (isConnected) {
      // When connected, update wasConnected state and save current path
      setWasConnected(true);
      if (!PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        // Only save protected routes
        localStorage.setItem(LAST_PATH_KEY, pathname);
      }
    }
  }, [isConnected, pathname]);

  // Effect for initial loading state
  useEffect(() => {
    // Small delay to ensure wallet connection is properly detected
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Increased timeout to give more time for wallet connection

    return () => clearTimeout(timer);
  }, []);

  // Check for reconnection scenario on initial load
  useEffect(() => {
    if (!isLoading && !isConnected) {
      const lastPath = localStorage.getItem(LAST_PATH_KEY);
      const isPublicRoute = PUBLIC_ROUTES.some(route => {
        return pathname === route || pathname.startsWith(`${route}/`);
      });

      // Only redirect if:
      // 1. User is on a protected route
      // 2. This isn't a refresh scenario (wasConnected is false)
      // 3. There's no saved path from a previous session
      if (!isPublicRoute && !wasConnected && (!lastPath || lastPath === "/")) {
        router.push("/");
      }
    }
  }, [isConnected, isLoading, pathname, router, wasConnected]);

  // If the user reconnects, restore their last path
  useEffect(() => {
    if (!isLoading && isConnected) {
      const lastPath = localStorage.getItem(LAST_PATH_KEY);
      // If user is on home page but was previously on a protected route, redirect them back
      if (pathname === "/" && lastPath && lastPath !== "/" && lastPath !== pathname) {
        router.push(lastPath);
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