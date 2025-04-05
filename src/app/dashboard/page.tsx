"use client";

import React from "react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-secondary rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 font-geist-mono">Welcome to your Dashboard</h2>
        <p className="text-foreground mb-4 font-geist-mono">
          This is a protected route that is only accessible when you are connected with your wallet.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <DashboardCard 
            title="Balance" 
            value="0.0 ETH" 
            icon="💰" 
          />
          <DashboardCard 
            title="Tips Given" 
            value="0" 
            icon="🎁" 
          />
          <DashboardCard 
            title="Tips Received" 
            value="0" 
            icon="🏆" 
          />
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
}

function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center">
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
} 