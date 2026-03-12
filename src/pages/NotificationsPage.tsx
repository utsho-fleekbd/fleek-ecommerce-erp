import { useState } from "react";
import { Search, CheckCircle } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const filtered = notifications.filter((n) => {
    const matchSearch =
      !search || n.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      n.status.toLowerCase() === filter ||
      n.channel.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "Read" } : n)),
    );
    toast({ title: "Notification marked as read" });
  };

  return (
    <>
      <PageHeader title="Notifications">
        <Button
          variant="outline"
          onClick={() => {
            setNotifications((prev) =>
              prev.map((n) => ({ ...n, status: "Read" })),
            );
            toast({ title: "All notifications marked as read" });
          }}
        >
          <CheckCircle className="h-4 w-4 mr-2" /> Mark All Read
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {["Type", "Title", "Channel", "Status", "Created", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No notifications found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((n) => (
                    <tr
                      key={n.id}
                      className={`border-b last:border-0 hover:bg-muted/50 transition-colors ${n.status === "Unread" ? "bg-primary/5" : ""}`}
                    >
                      <td className="py-2.5 px-3">
                        <Badge variant="secondary">{n.type}</Badge>
                      </td>
                      <td className="py-2.5 px-3 font-medium">{n.title}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {n.channel}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={
                            n.status === "Unread" ? "default" : "secondary"
                          }
                        >
                          {n.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground text-xs">
                        {n.created}
                      </td>
                      <td className="py-2.5 px-3">
                        {n.status === "Unread" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markRead(n.id)}
                          >
                            Mark read
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
