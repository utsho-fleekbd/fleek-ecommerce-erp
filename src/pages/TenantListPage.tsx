import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { mockTenants } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function TenantListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [suspendConfirm, setSuspendConfirm] = useState<string | null>(null);

  const filtered = mockTenants.filter((t) => {
    const matchSearch =
      !search ||
      t.business.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPkg = packageFilter === "all" || t.package === packageFilter;
    return matchSearch && matchStatus && matchPkg;
  });

  const handleCreate = async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setCreating(false);
    setShowCreate(false);
    toast({ title: "Tenant created successfully" });
  };

  return (
    <>
      <PageHeader title="Tenants">
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Tenant
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by name or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Trial">Trial</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            {(statusFilter !== "all" || packageFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setPackageFilter("all");
                }}
              >
                Clear
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {[
                    "Business Name",
                    "Owner",
                    "Email",
                    "Package",
                    "Status",
                    "Created",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <p>No tenants found.</p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => setShowCreate(true)}
                      >
                        Create Tenant
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/tenants/${t.id}`)}
                    >
                      <td className="py-2.5 px-3 font-medium">{t.business}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {t.owner}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {t.email}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant="secondary">{t.package}</Badge>
                      </td>
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
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {t.created}
                      </td>
                      <td
                        className="py-2.5 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/tenants/${t.id}`)}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setSuspendConfirm(t.business)}
                            >
                              Suspend Tenant
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Tenant Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[99vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Tenant</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {[
              { id: "biz", label: "Business name", placeholder: "Acme Corp" },
              { id: "slug", label: "Slug", placeholder: "acme-corp" },
              {
                id: "email",
                label: "Email",
                placeholder: "knock@acme.com",
              },
              { id: "phone", label: "Phone", placeholder: "+1 555 0100" },
            ].map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input id={f.id} placeholder={f.placeholder} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" type="file" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select defaultValue="starter">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="trial">Trial duration (days)</Label>
                <Input id="trial" type="number" defaultValue={14} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gbp">BDT</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Creating..." : "Create Tenant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation */}
      <Dialog
        open={!!suspendConfirm}
        onOpenChange={() => setSuspendConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Suspension</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to suspend <strong>{suspendConfirm}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setSuspendConfirm(null);
                toast({
                  title: "Tenant suspended",
                  description: `${suspendConfirm} has been suspended.`,
                });
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
