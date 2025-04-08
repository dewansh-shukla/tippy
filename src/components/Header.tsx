"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="w-full flex justify-center">
      <div className="w-full p-4 bg-primary text-white flex justify-between items-center  border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="w-1/4 text-xl font-bold font-geist-mono">
          BeraTip
        </Link>

        <div className="flex w-3/4 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center mr-4 space-x-6">
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="transition-colors font-geist-mono"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="transition-colors font-geist-mono"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
