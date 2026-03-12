import { useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockAddons } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export default function AddonListPage() {
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = mockAddons.filter(
    (a) => !search || a.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async () => {
    setCreating(true);
    await new Promise((r) => setTimeout(r, 1000));
    setCreating(false);
    setShowCreate(false);
    toast({ title: "Addon created successfully" });
  };

  return (
    <>
      <PageHeader title="Addons">
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Addon
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search addons..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {[
                    "Addon Name",
                    "Type",
                    "Limit Key",
                    "Unit Price",
                    "Status",
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
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium">{a.name}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant="secondary">{a.type}</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground font-mono text-xs">
                      {a.limitKey}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums">${a.unitPrice}</td>
                    <td className="py-2.5 px-3">
                      <Badge className="bg-success text-success-foreground">
                        {a.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3">
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
                          <DropdownMenuItem onClick={() => setShowCreate(true)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteConfirm(a.name)}
                          >
                            Delete
                          </DropdownMenuItem>
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

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md max-h-[99vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Addon</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label>Addon name</Label>
              <Input placeholder="Extra Storage" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input placeholder="extra-storage" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select defaultValue="usage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usage">Usage</SelectItem>
                    <SelectItem value="per-unit">Per Unit</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Unit price ($)</Label>
                <Input type="number" placeholder="2.50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Limit key</Label>
              <Input placeholder="storage_gb" />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Addon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteConfirm}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteConfirm(null);
                toast({ title: "Addon deleted" });
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
