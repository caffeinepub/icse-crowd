import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  Home,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { PageView } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { login, clear, loginStatus, identity, loginError } =
    useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled =
    loginStatus === "logging-in" || loginStatus === "initializing";

  // Show error toast when login fails
  useEffect(() => {
    if (loginStatus === "loginError" && loginError) {
      toast.error("Authentication Error", {
        description: loginError.message,
        duration: 5000,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  }, [loginStatus, loginError]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onNavigate("home");
    } else {
      login();
    }
  };

  const navItems = [
    { id: "home" as PageView, label: "Home", icon: Home },
    { id: "feed" as PageView, label: "Feed", icon: Users, authRequired: true },
    {
      id: "study-groups" as PageView,
      label: "Study Groups",
      icon: BookOpen,
      authRequired: true,
    },
    {
      id: "forum" as PageView,
      label: "Forum",
      icon: MessageSquare,
      authRequired: true,
    },
    {
      id: "chat" as PageView,
      label: "Chat",
      icon: MessageSquare,
      authRequired: true,
    },
  ];

  const visibleNavItems = navItems.filter(
    (item) => !item.authRequired || isAuthenticated,
  );

  const getButtonText = () => {
    if (loginStatus === "initializing") return "Initializing...";
    if (loginStatus === "logging-in") return "Signing in...";
    return isAuthenticated ? "Logout" : "Sign In";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2"
          >
            <img
              src="/assets/generated/icse-logo-transparent.dim_200x200.png"
              alt="ICSE Crowd"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold">ICSE Crowd</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
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
              <>
                <Button
                  variant={currentPage === "moderation" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate("moderation")}
                  className="gap-2"
                  data-ocid="nav.moderation.link"
                >
                  <Shield className="h-4 w-4" />
                  Moderation
                </Button>
                <Button
                  variant={currentPage === "admin" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate("admin")}
                  className="gap-2 text-destructive hover:text-destructive data-[active=true]:text-destructive-foreground"
                  data-active={currentPage === "admin"}
                  data-ocid="nav.admin.link"
                >
                  <Settings className="h-4 w-4" />
                  Admin
                </Button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {userProfile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{userProfile.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{userProfile.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {userProfile.email}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAuth}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleAuth} disabled={disabled}>
              {getButtonText()}
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
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => onNavigate("moderation")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Moderation
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onNavigate("admin")}
                    className="text-destructive focus:text-destructive"
                    data-ocid="nav.admin.mobile.link"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
