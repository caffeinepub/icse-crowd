import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import StudyGroupsPage from './pages/StudyGroupsPage';
import ForumPage from './pages/ForumPage';
import ChatPage from './pages/ChatPage';
import ModerationPage from './pages/ModerationPage';
import { useState } from 'react';

export type PageView = 'home' | 'feed' | 'study-groups' | 'forum' | 'chat' | 'moderation';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const renderPage = () => {
    if (!isAuthenticated) {
      return <HomePage />;
    }

    if (showProfileSetup) {
      return null;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'feed':
        return <FeedPage />;
      case 'study-groups':
        return <StudyGroupsPage />;
      case 'forum':
        return <ForumPage />;
      case 'chat':
        return <ChatPage />;
      case 'moderation':
        return <ModerationPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1">{renderPage()}</main>
        <Footer />
        {showProfileSetup && <ProfileSetupModal />}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
