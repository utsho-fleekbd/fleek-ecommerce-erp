import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, AlertTriangle, AlertCircle, Bug } from "lucide-react";
import { mockSystemLogs, mockErrors } from "@/data/mockData";

export default function MonitoringPage() {
  const navigate = useNavigate();
  const [logSearch, setLogSearch] = useState("");
  const [logLevel, setLogLevel] = useState("all");
  const [errorSearch, setErrorSearch] = useState("");

  const filteredLogs = mockSystemLogs.filter((l) => {
    const matchSearch = !logSearch || l.message.toLowerCase().includes(logSearch.toLowerCase());
    const matchLevel = logLevel === "all" || l.level === logLevel;
    return matchSearch && matchLevel;
  });

  const filteredErrors = mockErrors.filter((e) => !errorSearch || e.message.toLowerCase().includes(errorSearch.toLowerCase()) || e.service.toLowerCase().includes(errorSearch.toLowerCase()));

  const errorStats = [
    { label: "Total Errors", value: "1,247", icon: Bug },
    { label: "Critical", value: "23", icon: AlertCircle },
    { label: "Errors Today", value: "42", icon: AlertTriangle },
  ];

  return (
    <>
      <PageHeader title="Monitoring" />

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="errors">Error Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-9" value={logSearch} onChange={(e) => setLogSearch(e.target.value)} />
                </div>
                <Select value={logLevel} onValueChange={setLogLevel}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {["Level", "Service", "Message", "Timestamp"].map((h) => (
                        <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-12 text-muted-foreground">No logs found.</td></tr>
                    ) : filteredLogs.map((l) => (
                      <tr key={l.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <Badge variant={l.level === "error" ? "destructive" : l.level === "warning" ? "secondary" : "outline"} className={l.level === "warning" ? "bg-warning text-warning-foreground" : ""}>
                            {l.level}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{l.service}</td>
                        <td className="py-2.5 px-3">{l.message}</td>
                        <td className="py-2.5 px-3 text-muted-foreground text-xs tabular-nums">{l.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {errorStats.map((s) => (
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

          <Card>
            <CardContent className="p-4">
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search errors..." className="pl-9" value={errorSearch} onChange={(e) => setErrorSearch(e.target.value)} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {["Service", "Error Message", "Severity", "Time", "Tenant"].map((h) => (
                        <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredErrors.map((e) => (
                      <tr key={e.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-xs">{e.service}</td>
                        <td className="py-2.5 px-3">{e.message}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant={e.severity === "critical" ? "destructive" : "secondary"} className={e.severity === "high" ? "bg-warning text-warning-foreground" : ""}>
                            {e.severity}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground text-xs tabular-nums">{e.time}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{e.tenant}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
