import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { GlobalEngagementTracker } from "@/components/layout/GlobalEngagementTracker";
import { AnonymousUserInitializer } from "@/components/layout/AnonymousUserInitializer";
import { GlobalPricingModal } from "@/components/GlobalPricingModal";
import { AnonymousUserButton } from "@/components/ui/anonymous-user-button";
import { CurrencyProvider } from "@/lib/currencyContext";
import { ToastProvider } from "@/lib/toast-context";
import { AuthProvider } from "@/lib/auth-context";
import { UserAuthProvider } from "@/lib/user-auth-context";
import { AdminAuthProvider } from "@/lib/admin-auth-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { QueryProvider } from "@/lib/query-client-provider";
import { ChatProvider } from "@/lib/chat-context";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShoreAgents - Professional Offshore Solutions",
  description: "Leading provider of offshore talent solutions and business process outsourcing services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      </head>
      <body
        className={`${poppins.variable} ${roboto.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <CurrencyProvider>
            <ToastProvider>
              <AuthProvider>
                <UserAuthProvider>
                  <AdminAuthProvider>
                    <FavoritesProvider>
                      <ChatProvider>
                      {/* <AnonymousUserInitializer /> */}
                      <GlobalEngagementTracker />
                      <ScrollToTop />
                      <Navbar />
                      
                      <main>
                        {children}
                      </main>
                      <ConditionalFooter />
                      <BottomNav />
                      {/* <GlobalPricingModal /> */}
                      <AnonymousUserButton />
                      </ChatProvider>
                    </FavoritesProvider>
                  </AdminAuthProvider>
                </UserAuthProvider>
              </AuthProvider>
            </ToastProvider>
          </CurrencyProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
