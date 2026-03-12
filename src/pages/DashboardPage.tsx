import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockMrrData, mockTenantGrowth, mockTenants } from "@/data/mockData";

const stats = [
  {
    label: "Total Tenants",
    value: "1,482",
    change: "+2.1%",
    up: true,
    icon: Building2,
  },
  {
    label: "Active Tenants",
    value: "1,247",
    change: "+3.4%",
    up: true,
    icon: Users,
  },
  {
    label: "MRR",
    value: "$128,430",
    change: "+5.2%",
    up: true,
    icon: DollarSign,
  },
  {
    label: "Total Revenue",
    value: "$1.54M",
    change: "+12.3%",
    up: true,
    icon: TrendingUp,
  },
  {
    label: "Active Subs",
    value: "1,180",
    change: "+1.8%",
    up: true,
    icon: CreditCard,
  },
  {
    label: "Trial Accounts",
    value: "67",
    change: "-8.2%",
    up: false,
    icon: Clock,
  },
];

const alerts = [
  {
    message: "High CPU on tenant-db-03",
    time: "14 min ago",
    severity: "error",
  },
  {
    message: "Payment retry for tenant #45",
    time: "32 min ago",
    severity: "warning",
  },
  {
    message: "SSL cert expiring in 7 days",
    time: "1 hr ago",
    severity: "warning",
  },
  {
    message: "Storage at 85% for tenant #12",
    time: "2 hrs ago",
    severity: "info",
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="space-y-2 mb-2">
                <s.icon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {s.label}
                </span>
              </div>
              <div className="text-2xl font-bold tabular-nums">{s.value}</div>
              <div className="space-y-1 mt-1">
                <div className="flex items-center gap-1">
                  {s.up ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={`text-xs ${s.up ? "text-success" : "text-destructive"}`}
                  >
                    {s.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">from last month</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">MRR Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockMrrData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tenant Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockTenantGrowth}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Tenant Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                      Business
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                      Owner
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                      Package
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockTenants.slice(0, 5).map((t) => (
                    <tr
                      key={t.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-medium">{t.business}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {t.owner}
                      </td>
                      <td className="py-2.5 px-3">{t.package}</td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            t.status === "Active"
                              ? "default"
                              : t.status === "Trial"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            t.status === "Active"
                              ? "bg-success text-success-foreground"
                              : ""
                          }
                        >
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${a.severity === "error" ? "bg-destructive" : a.severity === "warning" ? "bg-warning" : "bg-primary"}`}
                />
                <div className="min-w-0">
                  <p className="text-sm leading-tight">{a.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
