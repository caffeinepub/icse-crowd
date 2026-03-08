import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Shield,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Variant_resolved_pending_reviewed } from "../backend";
import {
  useDeletePost,
  useGetAllUsers,
  useGetReports,
  useReviewReport,
} from "../hooks/useQueries";

export default function ModerationPage() {
  const { data: reports, isLoading: reportsLoading } = useGetReports();
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsers();
  const reviewReport = useReviewReport();
  const _deletePost = useDeletePost();

  const handleReviewReport = async (
    reportId: bigint,
    status: Variant_resolved_pending_reviewed,
  ) => {
    try {
      await reviewReport.mutateAsync({ reportId, newStatus: status });
      toast.success(`Report marked as ${status}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update report");
    }
  };

  const getStatusBadge = (status: Variant_resolved_pending_reviewed) => {
    if (status === Variant_resolved_pending_reviewed.pending) {
      return <Badge variant="outline">Pending</Badge>;
    }
    if (status === Variant_resolved_pending_reviewed.reviewed) {
      return <Badge variant="secondary">Reviewed</Badge>;
    }
    return <Badge>Resolved</Badge>;
  };

  if (reportsLoading || usersLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const pendingReports =
    reports?.filter(
      (r) => r.status === Variant_resolved_pending_reviewed.pending,
    ) || [];
  const reviewedReports =
    reports?.filter(
      (r) => r.status === Variant_resolved_pending_reviewed.reviewed,
    ) || [];
  const resolvedReports =
    reports?.filter(
      (r) => r.status === Variant_resolved_pending_reviewed.resolved,
    ) || [];

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Moderation Dashboard</h1>
          <p className="text-muted-foreground">
            Review reports and manage platform content
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedReports.length}</div>
            <p className="text-xs text-muted-foreground">Completed actions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingReports.length})
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Reviewed ({reviewedReports.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Reports that need review</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReports.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No pending reports
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReports.map((report) => (
                      <TableRow key={report.id.toString()}>
                        <TableCell className="font-mono text-xs">
                          {report.reporter.toString().slice(0, 10)}...
                        </TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(Number(report.timestamp) / 1000000),
                            {
                              addSuffix: true,
                            },
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleReviewReport(
                                  report.id,
                                  Variant_resolved_pending_reviewed.reviewed,
                                )
                              }
                              disabled={reviewReport.isPending}
                            >
                              Review
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleReviewReport(
                                  report.id,
                                  Variant_resolved_pending_reviewed.resolved,
                                )
                              }
                              disabled={reviewReport.isPending}
                            >
                              Resolve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Reports</CardTitle>
              <CardDescription>Reports that have been reviewed</CardDescription>
            </CardHeader>
            <CardContent>
              {reviewedReports.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No reviewed reports
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviewedReports.map((report) => (
                      <TableRow key={report.id.toString()}>
                        <TableCell className="font-mono text-xs">
                          {report.reporter.toString().slice(0, 10)}...
                        </TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(Number(report.timestamp) / 1000000),
                            {
                              addSuffix: true,
                            },
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleReviewReport(
                                report.id,
                                Variant_resolved_pending_reviewed.resolved,
                              )
                            }
                            disabled={reviewReport.isPending}
                          >
                            Resolve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Reports</CardTitle>
              <CardDescription>Reports that have been resolved</CardDescription>
            </CardHeader>
            <CardContent>
              {resolvedReports.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No resolved reports
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolvedReports.map((report) => (
                      <TableRow key={report.id.toString()}>
                        <TableCell className="font-mono text-xs">
                          {report.reporter.toString().slice(0, 10)}...
                        </TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(Number(report.timestamp) / 1000000),
                            {
                              addSuffix: true,
                            },
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
