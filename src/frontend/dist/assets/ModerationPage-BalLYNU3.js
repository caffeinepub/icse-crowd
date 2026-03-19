import { c as createLucideIcon, j as jsxRuntimeExports, w as cn, z as useGetReports, y as useGetAllUsers, C as useReviewReport, D as useDeletePost, L as LoaderCircle, V as Variant_resolved_pending_reviewed, S as Shield, B as Button, a as ue } from "./index-DNXQSw_4.js";
import { T as TriangleAlert, a as Tabs, b as TabsList, c as TabsTrigger, d as TabsContent, B as Badge } from "./tabs-s7EAAVTv.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-OOTnljHx.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode);
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function ModerationPage() {
  const { data: reports, isLoading: reportsLoading } = useGetReports();
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsers();
  const reviewReport = useReviewReport();
  useDeletePost();
  const handleReviewReport = async (reportId, status) => {
    try {
      await reviewReport.mutateAsync({ reportId, newStatus: status });
      ue.success(`Report marked as ${status}`);
    } catch (error) {
      ue.error(error.message || "Failed to update report");
    }
  };
  const getStatusBadge = (status) => {
    if (status === Variant_resolved_pending_reviewed.pending) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "Pending" });
    }
    if (status === Variant_resolved_pending_reviewed.reviewed) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Reviewed" });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: "Resolved" });
  };
  if (reportsLoading || usersLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) });
  }
  const pendingReports = (reports == null ? void 0 : reports.filter(
    (r) => r.status === Variant_resolved_pending_reviewed.pending
  )) || [];
  const reviewedReports = (reports == null ? void 0 : reports.filter(
    (r) => r.status === Variant_resolved_pending_reviewed.reviewed
  )) || [];
  const resolvedReports = (reports == null ? void 0 : reports.filter(
    (r) => r.status === Variant_resolved_pending_reviewed.resolved
  )) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-6 w-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Moderation Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Review reports and manage platform content" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Pending Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: pendingReports.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Require attention" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Total Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: (allUsers == null ? void 0 : allUsers.length) || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Registered users" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Resolved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: resolvedReports.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Completed actions" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "pending", className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "pending", children: [
          "Pending (",
          pendingReports.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "reviewed", children: [
          "Reviewed (",
          reviewedReports.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "resolved", children: [
          "Resolved (",
          resolvedReports.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pending", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Pending Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Reports that need review" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: pendingReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-muted-foreground", children: "No pending reports" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Reporter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: pendingReports.map((report) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs", children: [
              report.reporter.toString().slice(0, 10),
              "..."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: report.reason }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground", children: formatDistanceToNow(
              new Date(Number(report.timestamp) / 1e6),
              {
                addSuffix: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(report.status) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => handleReviewReport(
                    report.id,
                    Variant_resolved_pending_reviewed.reviewed
                  ),
                  disabled: reviewReport.isPending,
                  children: "Review"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: () => handleReviewReport(
                    report.id,
                    Variant_resolved_pending_reviewed.resolved
                  ),
                  disabled: reviewReport.isPending,
                  children: "Resolve"
                }
              )
            ] }) })
          ] }, report.id.toString())) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "reviewed", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Reviewed Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Reports that have been reviewed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: reviewedReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-muted-foreground", children: "No reviewed reports" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Reporter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: reviewedReports.map((report) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs", children: [
              report.reporter.toString().slice(0, 10),
              "..."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: report.reason }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground", children: formatDistanceToNow(
              new Date(Number(report.timestamp) / 1e6),
              {
                addSuffix: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(report.status) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                onClick: () => handleReviewReport(
                  report.id,
                  Variant_resolved_pending_reviewed.resolved
                ),
                disabled: reviewReport.isPending,
                children: "Resolve"
              }
            ) })
          ] }, report.id.toString())) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "resolved", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Resolved Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Reports that have been resolved" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: resolvedReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-muted-foreground", children: "No resolved reports" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Reporter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: resolvedReports.map((report) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-xs", children: [
              report.reporter.toString().slice(0, 10),
              "..."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: report.reason }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground", children: formatDistanceToNow(
              new Date(Number(report.timestamp) / 1e6),
              {
                addSuffix: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(report.status) })
          ] }, report.id.toString())) })
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  ModerationPage as default
};
