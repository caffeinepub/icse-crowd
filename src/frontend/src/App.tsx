import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// Lazy load page components for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const FeedPage = lazy(() => import("./pages/FeedPage"));
const StudyGroupsPage = lazy(() => import("./pages/StudyGroupsPage"));
const ForumPage = lazy(() => import("./pages/ForumPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ModerationPage = lazy(() => import("./pages/ModerationPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

export type PageView =
  | "home"
  | "feed"
  | "study-groups"
  | "forum"
  | "chat"
  | "moderation"
  | "admin";

// Loading fallback component
function PageLoadingFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading page...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { identity } = useInternetIdentity();
  const [currentPage, setCurrentPage] = useState<PageView>("home");

  const isAuthenticated = !!identity;

  const renderPage = () => {
    if (!isAuthenticated) {
      return <HomePage />;
    }

    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "feed":
        return <FeedPage />;
      case "study-groups":
        return <StudyGroupsPage />;
      case "forum":
        return <ForumPage />;
      case "chat":
        return <ChatPage />;
      case "moderation":
        return <ModerationPage />;
      case "admin":
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1">
          <Suspense fallback={<PageLoadingFallback />}>{renderPage()}</Suspense>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
