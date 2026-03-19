import { b as useInternetIdentity, r as reactExports, n as useGetStudyGroupMessages, o as useSendStudyGroupMessage, j as jsxRuntimeExports, L as LoaderCircle, B as Button, a as ue, g as useGetUserProfile, A as Avatar, h as AvatarFallback, p as useCreateStudyGroup, q as useJoinStudyGroup, s as useGetAllStudyGroups, U as Users, e as BookOpen } from "./index-DNXQSw_4.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle, d as CardDescription } from "./card-OOTnljHx.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BUSqyeSY.js";
import { I as Input } from "./input-Cb2tBxB6.js";
import { L as Label } from "./label-Dvx8yLT9.js";
import { T as Textarea } from "./textarea-DASlJyYV.js";
import { S as ScrollArea } from "./scroll-area-jyPApHgd.js";
import { n as normalizeICError } from "./icErrors-CWzto3lk.js";
import { g as getUserInitials } from "./userDisplay-CqG9piT-.js";
import { S as Send, M as MessageCircle } from "./send-BdeaRk0K.js";
import { P as Plus } from "./plus-BTWI8rLs.js";
import "./x-p_ZduJxi.js";
function StudyGroupChatDialog({
  group,
  open,
  onOpenChange
}) {
  const { identity } = useInternetIdentity();
  const [messageContent, setMessageContent] = reactExports.useState("");
  const scrollRef = reactExports.useRef(null);
  const currentPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const {
    data: messages = [],
    isLoading,
    isError,
    error
  } = useGetStudyGroupMessages(group.id, {
    enabled: open,
    refetchInterval: open ? 3e3 : void 0
    // Poll every 3 seconds when chat is open
  });
  const sendMessage = useSendStudyGroupMessage();
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) {
      return;
    }
    try {
      await sendMessage.mutateAsync({
        groupId: group.id,
        content: messageContent.trim()
      });
      setMessageContent("");
    } catch (error2) {
      const errorMessage = normalizeICError(error2);
      ue.error(errorMessage);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "flex h-[600px] max-w-2xl flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      group.name,
      " - Chat"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 pr-4", ref: scrollRef, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: normalizeICError(error) }) }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No messages yet. Start the conversation!" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 pb-4", children: messages.map((message) => {
        const isOwnMessage = message.sender.toString() === currentPrincipal;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          MessageItem,
          {
            message,
            isOwnMessage
          },
          message.id.toString()
        );
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSendMessage, className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: messageContent,
            onChange: (e) => setMessageContent(e.target.value),
            placeholder: "Type a message...",
            disabled: sendMessage.isPending
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            size: "icon",
            disabled: sendMessage.isPending || !messageContent.trim(),
            children: sendMessage.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] }) });
}
function MessageItem({ message, isOwnMessage }) {
  const { data: senderProfile } = useGetUserProfile(message.sender);
  const senderName = (senderProfile == null ? void 0 : senderProfile.name) || "Guest";
  const initials = getUserInitials(senderName);
  const timestamp = new Date(Number(message.timestamp) / 1e6);
  const timeString = timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: initials }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[70%]`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center gap-2 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: senderName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: timeString })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Card,
                {
                  className: `px-3 py-2 ${isOwnMessage ? "bg-primary text-primary-foreground" : ""}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm break-words", children: message.content })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function StudyGroupsPage() {
  const { identity } = useInternetIdentity();
  const createStudyGroup = useCreateStudyGroup();
  const joinStudyGroup = useJoinStudyGroup();
  const { data: studyGroups = [], isLoading: groupsLoading } = useGetAllStudyGroups();
  const [isDialogOpen, setIsDialogOpen] = reactExports.useState(false);
  const [groupName, setGroupName] = reactExports.useState("");
  const [groupDescription, setGroupDescription] = reactExports.useState("");
  const [selectedGroup, setSelectedGroup] = reactExports.useState(null);
  const [isChatOpen, setIsChatOpen] = reactExports.useState(false);
  const isAuthenticated = !!identity;
  const currentPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      ue.error("Please log in to create a study group");
      return;
    }
    setIsDialogOpen(true);
  };
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      ue.error("Please log in to create a study group");
      return;
    }
    if (!groupName.trim()) {
      ue.error("Please enter a group name");
      return;
    }
    try {
      await createStudyGroup.mutateAsync({
        name: groupName,
        description: groupDescription
      });
      ue.success("Study group created successfully!");
      setGroupName("");
      setGroupDescription("");
      setIsDialogOpen(false);
    } catch (error) {
      const errorMessage = normalizeICError(error);
      if (errorMessage.toLowerCase().includes("illegal") || errorMessage.toLowerCase().includes("inappropriate") || errorMessage.toLowerCase().includes("banned")) {
        ue.error(
          "Description contains inappropriate content. Please revise and try again."
        );
      } else {
        ue.error(errorMessage);
      }
    }
  };
  const handleJoinGroup = async (groupId) => {
    if (!isAuthenticated) {
      ue.error("Please log in to join a study group");
      return;
    }
    try {
      await joinStudyGroup.mutateAsync(groupId);
      ue.success("Successfully joined the study group!");
    } catch (error) {
      const errorMessage = normalizeICError(error);
      ue.error(errorMessage);
    }
  };
  const handleOpenChat = (group) => {
    setSelectedGroup(group);
    setIsChatOpen(true);
  };
  const isMember = (group) => {
    if (!currentPrincipal) return false;
    return group.members.some(
      (member) => member.toString() === currentPrincipal
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Study Groups" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Collaborate with classmates and share knowledge" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleOpenDialog, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Create Group"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create Study Group" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateGroup, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "groupName", children: "Group Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "groupName",
              value: groupName,
              onChange: (e) => setGroupName(e.target.value),
              placeholder: "e.g., Mathematics Grade 10",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "groupDescription", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "groupDescription",
              value: groupDescription,
              onChange: (e) => setGroupDescription(e.target.value),
              placeholder: "What is this group about?",
              rows: 3
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "w-full",
            disabled: createStudyGroup.isPending,
            children: createStudyGroup.isPending ? "Creating..." : "Create Group"
          }
        )
      ] })
    ] }) }),
    selectedGroup && /* @__PURE__ */ jsxRuntimeExports.jsx(
      StudyGroupChatDialog,
      {
        group: selectedGroup,
        open: isChatOpen,
        onOpenChange: setIsChatOpen
      }
    ),
    groupsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading study groups..." }) }) : studyGroups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 font-semibold", children: "No Groups Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm text-muted-foreground", children: "Create your first study group to start collaborating" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleOpenDialog, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        "Create Group"
      ] })
    ] }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: studyGroups.map((group) => {
      const memberStatus = isMember(group);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: group.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: group.description || "No description provided" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              group.members.length,
              " ",
              group.members.length === 1 ? "member" : "members"
            ] })
          ] }),
          isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: memberStatus ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "flex-1",
                disabled: true,
                children: "Joined"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "default",
                size: "sm",
                onClick: () => handleOpenChat(group),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" })
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "default",
              size: "sm",
              className: "w-full",
              onClick: () => handleJoinGroup(group.id),
              disabled: joinStudyGroup.isPending,
              children: joinStudyGroup.isPending ? "Joining..." : "Join Group"
            }
          ) })
        ] })
      ] }, group.id.toString());
    }) })
  ] });
}
export {
  StudyGroupsPage as default
};
