"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect if not authenticated (backup protection)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <p className="text-lg font-geist-mono">Loading your profile...</p>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }
  
  return <ProfileContent />;
}

function ProfileContent() {
  const { address } = useAuth();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {address?.substring(0, 2)}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Wallet</h2>
            <div className="flex items-center space-x-2">
              <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                {address ? 
                  `${address.substring(0, 6)}...${address.substring(address.length - 4)}` :
                  'Not connected'
                }
              </p>
              <button 
                onClick={() => {
                  if (address) {
                    navigator.clipboard.writeText(address);
                    alert('Address copied to clipboard!');
                  }
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Display Name</span>
              <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" id="toggle" className="sr-only" />
                <label
                  htmlFor="toggle"
                  className="block h-6 rounded-full cursor-pointer bg-gray-300 dark:bg-gray-600"
                ></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 