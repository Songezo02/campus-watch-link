import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, ShieldCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityBadge, StatusBadge } from "@/components/campus/shell";
import { useCampus } from "@/lib/campus-store";
import {
  CATEGORY_SPLIT,
  DAILY_INCIDENTS,
  RESPONSE_TREND,
  RISK_LOCATIONS,
  formatDateTime,
  responseGrade,
  responseMinutes,
} from "@/lib/campus-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Campus Security" },
      {
        name: "description",
        content:
          "Monitor incidents, approve officers, manage users and review campus response analytics.",
      },
      { property: "og:title", content: "Admin Dashboard — Campus Security" },
      {
        property: "og:description",
        content: "Campus Security administration, oversight and analytics.",
      },
    ],
  }),
  component: AdminDashboard,
});

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function AdminDashboard() {
  const {
    incidents,
    users,
    officers,
    logout,
    setUserStatus,
    setOfficerApproval,
    reassign,
    advanceIncident,
  } = useCampus();
  const navigate = useNavigate();

  const active = incidents.filter(
    (i) => !["Closed", "Resolved", "Cancelled by Reporter"].includes(i.status),
  );
  const resolved = incidents.filter((i) => i.status === "Resolved" || i.status === "Closed");
  const emergency = incidents.filter((i) => i.priority === "Critical");
  const available = officers.filter((o) => o.availability === "Available").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary px-5 py-5 text-primary-foreground md:px-10">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <ShieldCheck className="size-7" />
          <div>
            <h1 className="text-lg font-bold tracking-tight">Campus Security Admin Dashboard</h1>
            <p className="text-xs opacity-75">Incident oversight, officers, users and analytics</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="ml-auto rounded-xl"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6 md:px-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Summary label="Today's Incidents" value={incidents.length} tone="bg-primary-soft text-primary" />
          <Summary label="Active" value={active.length} tone="bg-warning-soft text-warning-foreground" />
          <Summary label="Resolved" value={resolved.length} tone="bg-success-soft text-success" />
          <Summary label="Emergency" value={emergency.length} tone="bg-emergency-soft text-emergency" />
          <Summary label="Available Officers" value={available} tone="bg-info-soft text-info" />
        </div>

        <Tabs defaultValue="incidents" className="mt-6">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="officers">Officers</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="mt-4 space-y-3">
            {incidents.map((i) => {
              const mins = responseMinutes(i);
              const grade = responseGrade(mins);
              return (
                <article key={i.id} className="surface-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold">#{i.id}</p>
                    <span className="text-sm text-muted-foreground">{i.category}</span>
                    <PriorityBadge priority={i.priority} />
                    <StatusBadge status={i.status} />
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatDateTime(i.reportedAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {i.locationName} · Reporter {i.reporterName} · Officer{" "}
                    {i.officerName ?? "Unassigned"} · Response {mins === null ? "—" : `${mins} min`} (
                    {grade.label})
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Select onValueChange={(v) => { reassign(i.id, v); toast.success("Incident reassigned"); }}>
                      <SelectTrigger className="h-9 w-56 rounded-xl">
                        <SelectValue placeholder="Reassign officer" />
                      </SelectTrigger>
                      <SelectContent>
                        {officers
                          .filter((o) => o.accountStatus === "Active")
                          .map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.fullName} · {o.availability}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => toast.warning(`#${i.id} escalated`)}
                    >
                      Escalate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => {
                        advanceIncident(i.id, "Closed");
                        toast.success(`#${i.id} closed`);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </article>
              );
            })}
          </TabsContent>

          <TabsContent value="officers" className="mt-4 space-y-3">
            {officers.map((o) => (
              <article key={o.id} className="surface-card flex flex-wrap items-center gap-3 p-4">
                <img src={o.photo} alt={o.fullName} className="size-11 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{o.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.number} · {o.shift} · {o.responded} incidents · avg {o.avgResponseMin} min
                  </p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                  {o.availability}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    o.accountStatus === "Active"
                      ? "bg-success-soft text-success"
                      : o.accountStatus === "Pending Approval"
                        ? "bg-warning-soft text-warning-foreground"
                        : "bg-emergency-soft text-emergency"
                  }`}
                >
                  {o.accountStatus}
                </span>
                <div className="ml-auto flex gap-2">
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={() => {
                      setOfficerApproval(o.id, "Active");
                      toast.success(`${o.fullName} approved`);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      setOfficerApproval(o.id, "Rejected");
                      toast(`${o.fullName} rejected`);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-xl"
                    onClick={() => {
                      setOfficerApproval(o.id, "Suspended");
                      toast(`${o.fullName} suspended`);
                    }}
                  >
                    Suspend
                  </Button>
                </div>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="users" className="mt-4 space-y-3">
            {users.map((u) => (
              <article key={u.id} className="surface-card flex flex-wrap items-center gap-3 p-4">
                <img src={u.photo} alt={u.fullName} className="size-11 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{u.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.number} · {u.email} · {u.role}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    u.accountStatus === "Active"
                      ? "bg-success-soft text-success"
                      : "bg-warning-soft text-warning-foreground"
                  }`}
                >
                  {u.accountStatus}
                </span>
                <div className="ml-auto flex gap-2">
                  <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={() => {
                      setUserStatus(u.id, "Active");
                      toast.success(`${u.fullName} activated`);
                    }}
                  >
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => {
                      setUserStatus(u.id, "Suspended");
                      toast(`${u.fullName} suspended`);
                    }}
                  >
                    Suspend
                  </Button>
                </div>
              </article>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="mt-4 grid gap-4 md:grid-cols-2">
            <ChartCard title="Incidents per day">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DAILY_INCIDENTS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="emergency" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Most common incident types">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={CATEGORY_SPLIT} dataKey="value" nameKey="name" outerRadius={80} label>
                    {CATEGORY_SPLIT.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Average response time (minutes)">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={RESPONSE_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke="var(--color-chart-3)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Highest-risk campus locations">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={RISK_LOCATIONS} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" fontSize={11} />
                  <YAxis dataKey="location" type="category" width={110} fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="var(--color-chart-4)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Summary({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-2xl p-4 ${tone}`}>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card p-4">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}
