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
  const router = useRouter();
  const pathname = usePathname();

  // Effect to store the last authenticated path
  useEffect(() => {
    if (isConnected) {
      // Only save non-public routes to localStorage
      if (!PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        localStorage.setItem(LAST_PATH_KEY, pathname);
      }
    }
  }, [isConnected, pathname]);

  // Handle initial loading and connection state
  useEffect(() => {
    // Reset loading state after a short delay to ensure wagmi has time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle route protection and redirects
  useEffect(() => {
    // Only proceed if we're done loading
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    if (!isConnected && !isPublicRoute) {
      // User is not connected and trying to access a protected route - redirect to home
      router.push("/");
    } else if (isConnected && pathname === "/") {
      // User is connected and on the home page - check if we should redirect to previous page
      const lastPath = localStorage.getItem(LAST_PATH_KEY);
      if (lastPath && lastPath !== "/" && lastPath !== pathname) {
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

    // Effect to handle protection logic
    useEffect(() => {
      // Only redirect after loading is complete and we know user is not authenticated
      if (!isLoading && !isAuthenticated) {
        router.push("/");
      }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking authentication
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Show redirecting message if not authenticated
    if (!isAuthenticated) {
      return <div className="flex justify-center items-center h-screen">Redirecting...</div>;
    }

    // Render the protected component if authenticated
    return <Component {...props} />;
  };

  // Set display name for debugging
  const displayName = Component.displayName || Component.name || "Component";
  ProtectedRoute.displayName = `withAuth(${displayName})`;

  return ProtectedRoute;
}