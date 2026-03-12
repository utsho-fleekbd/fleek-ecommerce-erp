import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  mockTenants,
  mockModules,
  mockBillingHistory,
  mockSystemLogs,
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const usageData = [
  { name: "Products", used: 742, limit: 1000 },
  { name: "Orders/mo", used: 1890, limit: 5000 },
  { name: "Storage (GB)", used: 4.2, limit: 10 },
  { name: "API Calls", used: 48200, limit: 100000 },
  { name: "SMS Credits", used: 320, limit: 500 },
];

const apiUsageByDay = [
  { day: "Mon", calls: 7200 },
  { day: "Tue", calls: 8100 },
  { day: "Wed", calls: 6800 },
  { day: "Thu", calls: 9200 },
  { day: "Fri", calls: 7600 },
  { day: "Sat", calls: 4200 },
  { day: "Sun", calls: 3100 },
];

const features: Record<string, { name: string; enabled: boolean }[]> = {
  Orders: [
    { name: "Allow returns", enabled: true },
    { name: "Allow partial payment", enabled: true },
    { name: "Allow COD", enabled: false },
  ],
  "Website Builder": [
    { name: "Enable AI site generation", enabled: false },
    { name: "Enable custom domain", enabled: true },
  ],
};

export default function TenantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const tenant = mockTenants.find((t) => t.id === id) || mockTenants[0];

  const [modules, setModules] = useState(
    mockModules.map((m) => ({ ...m, enabled: Math.random() > 0.3 })),
  );
  const [featureState, setFeatureState] = useState(features);

  const toggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === moduleId) {
          const newState = !m.enabled;
          toast({
            title: `${m.name} module ${newState ? "enabled" : "disabled"}`,
          });
          return { ...m, enabled: newState };
        }
        return m;
      }),
    );
  };

  const toggleFeature = (group: string, idx: number) => {
    setFeatureState((prev) => {
      const updated = { ...prev };
      updated[group] = [...updated[group]];
      updated[group][idx] = {
        ...updated[group][idx],
        enabled: !updated[group][idx].enabled,
      };
      toast({
        title: `${updated[group][idx].name} ${updated[group][idx].enabled ? "enabled" : "disabled"}`,
      });
      return updated;
    });
  };

  return (
    <>
      <PageHeader title={tenant.business}>
        <Button
          variant="destructive"
          onClick={() => toast({ title: "Tenant Suspended" })}
        >
          Suspend
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tenant Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["Business", tenant.business],
              ["Owner", tenant.owner],
              ["Email", tenant.email],
              ["Package", tenant.package],
              ["Created", tenant.created],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant={tenant.status === "Active" ? "default" : "destructive"}
                className={
                  tenant.status === "Active"
                    ? "bg-success text-success-foreground"
                    : ""
                }
              >
                {tenant.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start overflow-x-auto">
              {[
                "Overview",
                "Companies",
                "Usage",
                "Billing",
                "Modules",
                "Features",
                "Logs",
              ].map((t) => (
                <TabsTrigger key={t} value={t.toLowerCase()}>
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {usageData.slice(0, 4).map((u) => (
                  <Card key={u.name}>
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {u.name}
                      </div>
                      <div className="text-xl font-bold tabular-nums">
                        {u.used.toLocaleString()}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          / {u.limit.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(u.used / u.limit) * 100}
                        className="mt-2 h-1.5"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="companies" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                          Company
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                          Websites
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase">
                          Users
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {["Main Store", "Warehouse Ops", "Online Division"].map(
                        (c, i) => (
                          <tr
                            key={c}
                            className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-2.5 px-3 font-medium">{c}</td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {i + 1}
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {(i + 1) * 5}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usageData.map((u) => (
                  <Card key={u.name}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{u.name}</span>
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {u.used.toLocaleString()} / {u.limit.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(u.used / u.limit) * 100}
                        className="h-2"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    API Calls (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={apiUsageByDay}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="day"
                        tick={{
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 12,
                        }}
                      />
                      <YAxis
                        tick={{
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="calls"
                        fill="hsl(var(--chart-1))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {[
                            "Invoice #",
                            "Amount",
                            "Tax",
                            "Total",
                            "Status",
                            "Paid Date",
                          ].map((h) => (
                            <th
                              key={h}
                              className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mockBillingHistory.map((b) => (
                          <tr
                            key={b.id}
                            className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                          >
                            <td className="py-2.5 px-3 font-medium">{b.id}</td>
                            <td className="py-2.5 px-3 tabular-nums">
                              ${b.amount}
                            </td>
                            <td className="py-2.5 px-3 tabular-nums">
                              ${b.tax}
                            </td>
                            <td className="py-2.5 px-3 tabular-nums font-medium">
                              ${b.total}
                            </td>
                            <td className="py-2.5 px-3">
                              <Badge
                                variant={
                                  b.status === "Paid"
                                    ? "default"
                                    : "destructive"
                                }
                                className={
                                  b.status === "Paid"
                                    ? "bg-success text-success-foreground"
                                    : ""
                                }
                              >
                                {b.status}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {b.paidDate || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modules" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Module Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {modules.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm">{m.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.description}
                          </p>
                        </div>
                        <Switch
                          checked={m.enabled}
                          onCheckedChange={() => toggleModule(m.id)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-4 space-y-4">
              {Object.entries(featureState).map(([group, items]) => (
                <Card key={group}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {group} Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((f, i) => (
                      <div
                        key={f.name}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{f.name}</span>
                        <Switch
                          checked={f.enabled}
                          onCheckedChange={() => toggleFeature(group, i)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {["Level", "Service", "Message", "Time"].map((h) => (
                          <th
                            key={h}
                            className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockSystemLogs.slice(0, 4).map((l) => (
                        <tr
                          key={l.id}
                          className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-2.5 px-3">
                            <Badge
                              variant={
                                l.level === "error"
                                  ? "destructive"
                                  : l.level === "warning"
                                    ? "secondary"
                                    : "outline"
                              }
                              className={
                                l.level === "warning"
                                  ? "bg-warning text-warning-foreground"
                                  : ""
                              }
                            >
                              {l.level}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {l.service}
                          </td>
                          <td className="py-2.5 px-3">{l.message}</td>
                          <td className="py-2.5 px-3 text-muted-foreground text-xs">
                            {l.timestamp}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
