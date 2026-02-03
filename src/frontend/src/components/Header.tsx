import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Users, BookOpen, MessageSquare, Shield, Menu } from 'lucide-react';
import type { PageView } from '../App';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onNavigate('home');
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { id: 'home' as PageView, label: 'Home', icon: Home },
    { id: 'feed' as PageView, label: 'Feed', icon: Users, authRequired: true },
    { id: 'study-groups' as PageView, label: 'Study Groups', icon: BookOpen, authRequired: true },
    { id: 'forum' as PageView, label: 'Forum', icon: MessageSquare, authRequired: true },
    { id: 'chat' as PageView, label: 'Chat', icon: MessageSquare, authRequired: true },
  ];

  const visibleNavItems = navItems.filter((item) => !item.authRequired || isAuthenticated);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <img src="/assets/generated/icse-logo-transparent.dim_200x200.png" alt="ICSE Crowd" className="h-10 w-10" />
            <span className="text-xl font-bold">ICSE Crowd</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            {isAdmin && (
              <Button
                variant={currentPage === 'moderation' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('moderation')}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Moderation
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{userProfile.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{userProfile.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{userProfile.name}</div>
                  <div className="text-xs text-muted-foreground">{userProfile.email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAuth}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleAuth} disabled={disabled}>
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.id} onClick={() => onNavigate(item.id)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
              {isAdmin && (
                <DropdownMenuItem onClick={() => onNavigate('moderation')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Moderation
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
