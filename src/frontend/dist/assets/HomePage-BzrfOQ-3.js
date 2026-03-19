import { c as createLucideIcon, r as reactExports, u as useCreateUserProfile, j as jsxRuntimeExports, B as Button, a as ue, b as useInternetIdentity, d as useGetCallerUserProfile, U as Users, e as BookOpen, M as MessageSquare, S as Shield } from "./index-DNXQSw_4.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-OOTnljHx.js";
import { P as PostComposer } from "./PostComposer-BFGRTPe3.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-BUSqyeSY.js";
import { I as Input } from "./input-Cb2tBxB6.js";
import { L as Label } from "./label-Dvx8yLT9.js";
import { T as Textarea } from "./textarea-DASlJyYV.js";
import "./icErrors-CWzto3lk.js";
import "./x-p_ZduJxi.js";
import "./file-text-TYf6-9fn.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function ProfileSetupModal({
  open,
  onOpenChange,
  onSuccess
}) {
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [academicDetails, setAcademicDetails] = reactExports.useState("");
  const createProfile = useCreateUserProfile();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      ue.error("Please fill in all required fields");
      return;
    }
    try {
      await createProfile.mutateAsync({ name, email, academicDetails });
      ue.success("Profile created successfully!");
      setName("");
      setEmail("");
      setAcademicDetails("");
      onOpenChange(false);
      onSuccess == null ? void 0 : onSuccess();
    } catch (error) {
      ue.error(error.message || "Failed to create profile");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Welcome to ICSE Connect!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Please set up your profile to get started." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "name", children: [
          "Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "name",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Enter your full name",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "email", children: [
          "Email ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "your.email@example.com",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "academicDetails", children: "Academic Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "academicDetails",
            value: academicDetails,
            onChange: (e) => setAcademicDetails(e.target.value),
            placeholder: "Grade, subjects, interests...",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "w-full",
          disabled: createProfile.isPending,
          children: createProfile.isPending ? "Creating Profile..." : "Create Profile"
        }
      )
    ] })
  ] }) });
}
function HomePage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const {
    data: currentUserProfile,
    isLoading: profileLoading,
    isFetched
  } = useGetCallerUserProfile();
  const [showProfileModal, setShowProfileModal] = reactExports.useState(false);
  const isAuthenticated = !!identity;
  const hasProfile = !!currentUserProfile;
  const showCreateProfileButton = isAuthenticated && !profileLoading && isFetched && !hasProfile;
  const features = [
    {
      icon: Users,
      title: "Social Networking",
      description: "Connect with fellow ICSE students, share posts, and build your academic network."
    },
    {
      icon: BookOpen,
      title: "Study Groups",
      description: "Create and join study groups, share notes, and collaborate on academic projects."
    },
    {
      icon: MessageSquare,
      title: "Q&A Forums",
      description: "Ask questions, share knowledge, and engage in academic discussions."
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Report inappropriate content and block users to maintain a positive community."
    }
  ];
  const contactEmail = "aryananilshinde6122009@gmail.com";
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      ue.success("Email copied to clipboard!");
    } catch (_error) {
      ue.error("Failed to copy email. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    showCreateProfileButton && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-8 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "lg",
        onClick: () => setShowProfileModal(true),
        className: "gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
          "Create Profile"
        ]
      }
    ) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-6 text-4xl font-bold tracking-tight md:text-6xl", children: "Connect, Learn, and Grow Together" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-8 text-lg text-muted-foreground md:text-xl", children: "The social media platform designed exclusively for ICSE students. Build friendships, collaborate on studies, and excel academically." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center", children: [
          !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              onClick: login,
              disabled: loginStatus === "logging-in",
              children: loginStatus === "logging-in" ? "Logging in..." : "Get Started"
            }
          ),
          showCreateProfileButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              onClick: () => setShowProfileModal(true),
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
                "Create Profile"
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/assets/generated/campus-hero.dim_1200x600.png",
          alt: "Campus",
          className: "h-full w-full object-cover"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-3xl font-bold md:text-4xl", children: "Everything You Need to Succeed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground", children: "A comprehensive platform combining social networking with academic collaboration" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4", children: features.map((feature) => {
        const Icon = feature.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: feature.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: feature.description }) })
        ] }, feature.title);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/50 py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 md:grid-cols-2 md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-3xl font-bold md:text-4xl", children: "Collaborate on Your Studies" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 text-lg text-muted-foreground", children: "Join study groups, share notes, and work together with classmates. Our platform makes academic collaboration seamless and effective." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Create and manage study groups" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Share notes and resources" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discuss topics in Q&A forums" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/assets/generated/study-collaboration.dim_800x600.png",
          alt: "Study Collaboration",
          className: "rounded-lg shadow-lg"
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-16 md:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 md:grid-cols-2 md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "order-2 md:order-1 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/assets/generated/forum-mockup.dim_1024x768.png",
          alt: "Forum",
          className: "rounded-lg shadow-lg"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "order-1 md:order-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-3xl font-bold md:text-4xl", children: "Safe and Moderated Community" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 text-lg text-muted-foreground", children: "We prioritize your safety with comprehensive moderation tools. Report inappropriate content, block users, and enjoy a positive learning environment." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Report inappropriate content" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Block unwanted users" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active moderation team" })
          ] })
        ] })
      ] })
    ] }) }) }),
    !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-primary py-16 text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-3xl font-bold md:text-4xl", children: "Ready to Join?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-8 text-lg opacity-90", children: "Start connecting with fellow ICSE students and enhance your academic journey today." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          variant: "secondary",
          onClick: login,
          disabled: loginStatus === "logging-in",
          children: loginStatus === "logging-in" ? "Logging in..." : "Sign Up Now"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-8 w-8 text-primary" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-2xl font-bold md:text-3xl", children: "For Inquiries & Advertising" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 text-muted-foreground", children: "Have questions or interested in advertising opportunities? Get in touch with us." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 sm:flex-row sm:justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `mailto:${contactEmail}`,
            className: "text-lg font-medium text-primary hover:underline",
            children: contactEmail
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleCopyEmail,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }),
              "Copy Email"
            ]
          }
        )
      ] })
    ] }) }) }),
    isAuthenticated && hasProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-2xl font-bold md:text-3xl", children: "Share Your Thoughts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Create a post to connect with the ICSE community" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PostComposer, {})
    ] }) }) }),
    isAuthenticated && showCreateProfileButton && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-8 w-8 text-primary" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-2xl font-bold md:text-3xl", children: "Complete Your Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 text-muted-foreground", children: "Create your profile to start posting, connecting with students, and joining the ICSE community." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "lg",
          onClick: () => setShowProfileModal(true),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-5 w-5" }),
            "Create Profile"
          ]
        }
      ) })
    ] }) }) }),
    !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-16 md:py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-8 w-8 text-primary" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-2xl font-bold md:text-3xl", children: "Join the Conversation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 text-muted-foreground", children: "Sign in to share posts, connect with students, and be part of the ICSE community." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "lg",
          onClick: login,
          disabled: loginStatus === "logging-in",
          children: loginStatus === "logging-in" ? "Logging in..." : "Login to Post"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProfileSetupModal,
      {
        open: showProfileModal,
        onOpenChange: setShowProfileModal,
        onSuccess: () => {
        }
      }
    )
  ] });
}
export {
  HomePage as default
};
