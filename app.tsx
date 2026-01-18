import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginScreen from './pages/LoginScreen';
import ProfileSetup from './pages/ProfileSetup';
import RoleSelection from './pages/RoleSelection';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PrivacyNoticeBanner from './components/PrivacyNoticeBanner';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<'main' | 'privacy'>('main');

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Show loading during initialization
  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LoginScreen onPrivacyClick={() => setCurrentPage('privacy')} />
        {currentPage === 'privacy' && (
          <PrivacyPolicy onClose={() => setCurrentPage('main')} isModal />
        )}
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show profile setup if user is authenticated but has no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header onPrivacyClick={() => setCurrentPage('privacy')} />
          <main className="flex-1">
            {currentPage === 'privacy' ? (
              <PrivacyPolicy onClose={() => setCurrentPage('main')} />
            ) : (
              <ProfileSetup />
            )}
          </main>
          <Footer onPrivacyClick={() => setCurrentPage('privacy')} />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show loading while profile is being fetched
  if (profileLoading || !isFetched) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Main application with role selection
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header onPrivacyClick={() => setCurrentPage('privacy')} />
        <main className="flex-1">
          {currentPage === 'privacy' ? (
            <PrivacyPolicy onClose={() => setCurrentPage('main')} />
          ) : (
            <>
              <PrivacyNoticeBanner />
              <RoleSelection />
            </>
          )}
        </main>
        <Footer onPrivacyClick={() => setCurrentPage('privacy')} />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
