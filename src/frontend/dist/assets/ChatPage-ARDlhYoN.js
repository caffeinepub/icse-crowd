import { x as useSendMessage, y as useGetAllUsers, r as reactExports, j as jsxRuntimeExports, A as Avatar, h as AvatarFallback, B as Button, a as ue } from "./index-DNXQSw_4.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-OOTnljHx.js";
import { I as Input } from "./input-Cb2tBxB6.js";
import { S as ScrollArea } from "./scroll-area-jyPApHgd.js";
import { M as MessageCircle, S as Send } from "./send-BdeaRk0K.js";
function ChatPage() {
  var _a;
  const sendMessage = useSendMessage();
  const { data: allUsers } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [messageContent, setMessageContent] = reactExports.useState("");
  const handleSendMessage = async () => {
    if (!selectedUser || !messageContent.trim()) {
      ue.error("Please select a user and enter a message");
      return;
    }
    try {
      await sendMessage.mutateAsync({
        to: selectedUser,
        content: messageContent
      });
      setMessageContent("");
      ue.success("Message sent!");
    } catch (error) {
      ue.error(error.message || "Failed to send message");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Messages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Chat with your friends and classmates" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "md:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Contacts" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[500px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: allUsers && allUsers.length > 0 ? allUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setSelectedUser(user.principal),
            className: `flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent ${(selectedUser == null ? void 0 : selectedUser.toString()) === user.principal.toString() ? "bg-accent" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: user.name.charAt(0).toUpperCase() }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium", children: user.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: user.email })
              ] })
            ]
          },
          user.principal.toString()
        )) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-sm text-muted-foreground", children: "No contacts yet" }) }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: selectedUser ? `Chat with ${(_a = allUsers == null ? void 0 : allUsers.find((u) => u.principal.toString() === selectedUser.toString())) == null ? void 0 : _a.name}` : "Select a contact" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: selectedUser ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[400px] rounded-lg border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mb-4 h-12 w-12 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Start a conversation by sending a message" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Type a message...",
                value: messageContent,
                onChange: (e) => setMessageContent(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSendMessage,
                disabled: sendMessage.isPending,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-[500px] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Select a contact to start chatting" })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  ChatPage as default
};
