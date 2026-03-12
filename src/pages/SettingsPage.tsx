import { useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const sections = ["General", "Security", "Email"];

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("General");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast({ title: "Settings saved successfully" });
  };

  return (
    <>
      <PageHeader title="Platform Settings" />

      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        <nav className="flex md:flex-col gap-1">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={cn(
                "text-left px-3 py-2 rounded-lg text-sm transition-colors",
                activeSection === s
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </nav>

        <div>
          {activeSection === "General" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-w-lg">
                <div className="space-y-1.5">
                  <Label>Platform name</Label>
                  <Input defaultValue="SaaS ERP Platform" />
                </div>
                <div className="space-y-1.5">
                  <Label>Default timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                      <SelectItem value="cet">CET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Default currency</Label>
                  <Select defaultValue="bdt">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bdt">BDT</SelectItem>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "Security" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-w-lg">
                <div className="space-y-1.5">
                  <Label>Session timeout (minutes)</Label>
                  <Input type="number" defaultValue={30} />
                </div>
                <div className="space-y-1.5">
                  <Label>Minimum password length</Label>
                  <Input type="number" defaultValue={8} />
                </div>
                <div className="space-y-1.5">
                  <Label>Password requirements</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">
                        Basic (min length only)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (letters + numbers)
                      </SelectItem>
                      <SelectItem value="strong">
                        Strong (mixed case + special chars)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "Email" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-w-lg">
                <div className="space-y-1.5">
                  <Label>SMTP Host</Label>
                  <Input defaultValue="smtp.example.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Port</Label>
                  <Input type="number" defaultValue={587} />
                </div>
                <div className="space-y-1.5">
                  <Label>Sender email</Label>
                  <Input type="email" defaultValue="noreply@platform.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>SMTP Username</Label>
                  <Input defaultValue="smtp-user" />
                </div>
                <div className="space-y-1.5">
                  <Label>SMTP Password</Label>
                  <Input type="password" defaultValue="password" />
                </div>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
