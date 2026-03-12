import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { mockPackages, mockModules } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const limits = [
  { key: "max_products", label: "Max Products", values: { Starter: 100, Growth: 1000, Enterprise: 10000 } },
  { key: "max_warehouses", label: "Max Warehouses", values: { Starter: 1, Growth: 5, Enterprise: 25 } },
  { key: "max_users", label: "Max Users", values: { Starter: 5, Growth: 25, Enterprise: 100 } },
  { key: "max_orders", label: "Max Orders/mo", values: { Starter: 500, Growth: 5000, Enterprise: 50000 } },
  { key: "max_websites", label: "Max Websites", values: { Starter: 1, Growth: 3, Enterprise: 10 } },
];

export default function PackageListPage() {
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Module matrix state
  const [moduleMatrix, setModuleMatrix] = useState<Record<string, Record<string, boolean>>>(
    Object.fromEntries(mockModules.map((m) => [m.id, { Starter: m.id !== "5" && m.id !== "6", Growth: m.id !== "6", Enterprise: true }]))
  );

  const filtered = mockPackages.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCreating(false);
    setShowCreate(false);
    setShowEdit(null);
    toast({ title: showEdit ? "Package updated" : "Package created successfully" });
  };

  const formFields = (
    <div className="grid gap-4 py-4">
      <div className="space-y-1.5"><Label>Package name</Label><Input placeholder="Growth" /></div>
      <div className="space-y-1.5"><Label>Slug</Label><Input placeholder="growth" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>Monthly price ($)</Label><Input type="number" placeholder="149" /></div>
        <div className="space-y-1.5"><Label>Yearly price ($)</Label><Input type="number" placeholder="1430" /></div>
      </div>
      <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Package description..." /></div>
      <div className="space-y-1.5">
        <Label>Status</Label>
        <Select defaultValue="active">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title="Packages">
        <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-2" /> Create Package</Button>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Package List</TabsTrigger>
          <TabsTrigger value="matrix">Module Matrix</TabsTrigger>
          <TabsTrigger value="limits">Limit Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search packages..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {["Package", "Monthly", "Yearly", "Status", "Subscribers", ""].map((h) => (
                        <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 px-3 font-medium">{p.name}</td>
                        <td className="py-2.5 px-3 tabular-nums">${p.monthlyPrice}</td>
                        <td className="py-2.5 px-3 tabular-nums">${p.yearlyPrice}</td>
                        <td className="py-2.5 px-3"><Badge variant="default" className="bg-success text-success-foreground">{p.status}</Badge></td>
                        <td className="py-2.5 px-3 tabular-nums">{p.subscribers}</td>
                        <td className="py-2.5 px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setShowEdit(p.id)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteConfirm(p.name)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Module</th>
                      {mockPackages.map((p) => (
                        <th key={p.id} className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockModules.map((m) => (
                      <tr key={m.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 px-3 font-medium">{m.name}</td>
                        {mockPackages.map((p) => (
                          <td key={p.id} className="py-2.5 px-3 text-center">
                            <Checkbox
                              checked={moduleMatrix[m.id]?.[p.name] ?? false}
                              onCheckedChange={(checked) => {
                                setModuleMatrix((prev) => ({
                                  ...prev,
                                  [m.id]: { ...prev[m.id], [p.name]: !!checked },
                                }));
                                toast({ title: `${m.name} ${checked ? "enabled" : "disabled"} for ${p.name}` });
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">Limit</th>
                      {mockPackages.map((p) => (
                        <th key={p.id} className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground uppercase">{p.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {limits.map((l) => (
                      <tr key={l.key} className="border-b last:border-0">
                        <td className="py-2.5 px-3 font-medium">{l.label}</td>
                        {mockPackages.map((p) => (
                          <td key={p.id} className="py-2.5 px-3 text-center">
                            <Input type="number" className="w-24 mx-auto text-center" defaultValue={l.values[p.name as keyof typeof l.values]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => toast({ title: "Limits saved successfully" })}>Save Limits</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      <Dialog open={showCreate || !!showEdit} onOpenChange={() => { setShowCreate(false); setShowEdit(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{showEdit ? "Edit Package" : "Create Package"}</DialogTitle></DialogHeader>
          {formFields}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); setShowEdit(null); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={creating}>{creating ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Package</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <strong>{deleteConfirm}</strong>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setDeleteConfirm(null); toast({ title: "Package deleted" }); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
