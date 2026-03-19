import { t as useCreateForumPost, r as reactExports, j as jsxRuntimeExports, B as Button, M as MessageSquare, a as ue } from "./index-DNXQSw_4.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle, d as CardDescription } from "./card-OOTnljHx.js";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BUSqyeSY.js";
import { I as Input } from "./input-Cb2tBxB6.js";
import { L as Label } from "./label-Dvx8yLT9.js";
import { T as Textarea } from "./textarea-DASlJyYV.js";
import { P as Plus } from "./plus-BTWI8rLs.js";
import "./x-p_ZduJxi.js";
function ForumPage() {
  const createForumPost = useCreateForumPost();
  const [isDialogOpen, setIsDialogOpen] = reactExports.useState(false);
  const [subject, setSubject] = reactExports.useState("");
  const [content, setContent] = reactExports.useState("");
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      ue.error("Please fill in all fields");
      return;
    }
    try {
      await createForumPost.mutateAsync({ subject, content });
      ue.success("Forum post created successfully!");
      setSubject("");
      setContent("");
      setIsDialogOpen(false);
    } catch (error) {
      ue.error(error.message || "Failed to create forum post");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Q&A Forum" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Ask questions and share knowledge with the community" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Ask Question"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create Forum Post" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreatePost, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subject", children: "Subject" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "subject",
                  value: subject,
                  onChange: (e) => setSubject(e.target.value),
                  placeholder: "What's your question about?",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "content", children: "Question Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "content",
                  value: content,
                  onChange: (e) => setContent(e.target.value),
                  placeholder: "Provide more details about your question...",
                  rows: 5,
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "w-full",
                disabled: createForumPost.isPending,
                children: createForumPost.isPending ? "Posting..." : "Post Question"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-8 w-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 font-semibold", children: "No Questions Yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm text-muted-foreground", children: "Be the first to ask a question and start a discussion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setIsDialogOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Ask Question"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Example: How to solve quadratic equations?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Posted 2 hours ago by Student123" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "I'm having trouble understanding the quadratic formula. Can someone explain the steps?" }) })
      ] })
    ] })
  ] });
}
export {
  ForumPage as default
};
