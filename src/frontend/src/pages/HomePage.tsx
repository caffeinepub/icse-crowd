import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Copy,
  Mail,
  MessageSquare,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PostComposer from "../components/PostComposer";
import ProfileSetupModal from "../components/ProfileSetupModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function HomePage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const {
    data: currentUserProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isAuthenticated = !!identity;
  const hasProfile = !!currentUserProfile;
  const showCreateProfileButton =
    isAuthenticated && !profileLoading && isFetched && !hasProfile;

  const features = [
    {
      icon: Users,
      title: "Social Networking",
      description:
        "Connect with fellow ICSE students, share posts, and build your academic network.",
    },
    {
      icon: BookOpen,
      title: "Study Groups",
      description:
        "Create and join study groups, share notes, and collaborate on academic projects.",
    },
    {
      icon: MessageSquare,
      title: "Q&A Forums",
      description:
        "Ask questions, share knowledge, and engage in academic discussions.",
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description:
        "Report inappropriate content and block users to maintain a positive community.",
    },
  ];

  const contactEmail = "aryananilshinde6122009@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      toast.success("Email copied to clipboard!");
    } catch (_error) {
      toast.error("Failed to copy email. Please try again.");
    }
  };

  return (
    <div className="flex flex-col">
      {showCreateProfileButton && (
        <section className="bg-background py-8 border-b">
          <div className="container">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setShowProfileModal(true)}
                className="gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Create Profile
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Connect, Learn, and Grow Together
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              The social media platform designed exclusively for ICSE students.
              Build friendships, collaborate on studies, and excel academically.
            </p>
            <div className="flex justify-center">
              {!isAuthenticated && (
                <Button
                  size="lg"
                  onClick={login}
                  disabled={loginStatus === "logging-in"}
                >
                  {loginStatus === "logging-in"
                    ? "Logging in..."
                    : "Get Started"}
                </Button>
              )}
              {showCreateProfileButton && (
                <Button
                  size="lg"
                  onClick={() => setShowProfileModal(true)}
                  className="gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Create Profile
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 opacity-20">
          <img
            src="/assets/generated/campus-hero.dim_1200x600.png"
            alt="Campus"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              A comprehensive platform combining social networking with academic
              collaboration
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Collaborate on Your Studies
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Join study groups, share notes, and work together with
                classmates. Our platform makes academic collaboration seamless
                and effective.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Create and manage study groups</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Share notes and resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Discuss topics in Q&A forums</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/study-collaboration.dim_800x600.png"
                alt="Study Collaboration"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="order-2 md:order-1 relative">
              <img
                src="/assets/generated/forum-mockup.dim_1024x768.png"
                alt="Forum"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Safe and Moderated Community
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                We prioritize your safety with comprehensive moderation tools.
                Report inappropriate content, block users, and enjoy a positive
                learning environment.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Report inappropriate content</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Block unwanted users</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Active moderation team</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Join?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Start connecting with fellow ICSE students and enhance your
              academic journey today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={login}
              disabled={loginStatus === "logging-in"}
            >
              {loginStatus === "logging-in" ? "Logging in..." : "Sign Up Now"}
            </Button>
          </div>
        </section>
      )}

      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              For Inquiries & Advertising
            </h2>
            <p className="mb-6 text-muted-foreground">
              Have questions or interested in advertising opportunities? Get in
              touch with us.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href={`mailto:${contactEmail}`}
                className="text-lg font-medium text-primary hover:underline"
              >
                {contactEmail}
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyEmail}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated && hasProfile && (
        <section className="bg-background py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                  Share Your Thoughts
                </h2>
                <p className="text-muted-foreground">
                  Create a post to connect with the ICSE community
                </p>
              </div>
              <PostComposer />
            </div>
          </div>
        </section>
      )}

      {isAuthenticated && showCreateProfileButton && (
        <section className="bg-background py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                Complete Your Profile
              </h2>
              <p className="mb-6 text-muted-foreground">
                Create your profile to start posting, connecting with students,
                and joining the ICSE community.
              </p>
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={() => setShowProfileModal(true)}
                  className="gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Create Profile
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isAuthenticated && (
        <section className="bg-background py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                Join the Conversation
              </h2>
              <p className="mb-6 text-muted-foreground">
                Sign in to share posts, connect with students, and be part of
                the ICSE community.
              </p>
              <Button
                size="lg"
                onClick={login}
                disabled={loginStatus === "logging-in"}
              >
                {loginStatus === "logging-in"
                  ? "Logging in..."
                  : "Login to Post"}
              </Button>
            </div>
          </div>
        </section>
      )}

      <ProfileSetupModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        onSuccess={() => {
          // Profile will be refetched automatically via query invalidation
        }}
      />
    </div>
  );
}
