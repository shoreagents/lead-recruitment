import type { Metadata } from "next";
import { CurrencyProvider } from "@/lib/currencyContext";
import { ToastProvider } from "@/lib/toast-context";
import { AuthProvider } from "@/lib/auth-context";
import { UserAuthProvider } from "@/lib/user-auth-context";
import { AdminAuthProvider } from "@/lib/admin-auth-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Admin Dashboard - ShoreAgents",
  description: "Admin dashboard for ShoreAgents administrators",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <ToastProvider>
        <AuthProvider>
          <UserAuthProvider>
            <AdminAuthProvider>
              <FavoritesProvider>
                <div className="min-h-screen bg-gray-50">
                  {children}
                </div>
                <Toaster />
              </FavoritesProvider>
            </AdminAuthProvider>
          </UserAuthProvider>
        </AuthProvider>
      </ToastProvider>
    </CurrencyProvider>
  );
}
