import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Receipt, AlertCircle, RotateCcw } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Total Revenue", value: "$1,540,200", icon: DollarSign },
  { label: "MRR", value: "$128,430", icon: TrendingUp },
  { label: "ARR", value: "$1,541,160", icon: Receipt },
  { label: "Outstanding", value: "$12,340", icon: AlertCircle },
  { label: "Refunds", value: "$3,210", icon: RotateCcw },
];

const revenueOverTime = [
  { month: "Jul", revenue: 98000 }, { month: "Aug", revenue: 105000 },
  { month: "Sep", revenue: 112000 }, { month: "Oct", revenue: 118000 },
  { month: "Nov", revenue: 124000 }, { month: "Dec", revenue: 128000 },
  { month: "Jan", revenue: 132000 }, { month: "Feb", revenue: 128430 },
];

const revenueByPackage = [
  { name: "Starter", value: 11466 },
  { name: "Growth", value: 84483 },
  { name: "Enterprise", value: 56511 },
];

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-5))"];

export default function BillingOverviewPage() {
  return (
    <>
      <PageHeader title="Billing Overview" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold tabular-nums">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Revenue Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Package</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={revenueByPackage} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {revenueByPackage.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
