import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Dashboard - ShoreAgents",
  description: "Client dashboard for ShoreAgents team management",
};

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
