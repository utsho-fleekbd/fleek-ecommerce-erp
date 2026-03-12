import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  tenants: "Tenants",
  "tenants/create": "Create Tenant",
  packages: "Packages",
  "packages/create": "Create Package",
  addons: "Addons",
  "addons/create": "Create Addon",
  billing: "Billing",
  reports: "Reports",
  notifications: "Notifications",
  monitoring: "Monitoring",
  "monitoring/errors": "Error Monitoring",
  "monitoring/logs": "System Logs",
  settings: "Settings",
};

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  // Check for dynamic tenant detail route
  const isTenantDetail = segments[0] === "tenants" && segments.length === 2 && segments[1] !== "create";

  const crumbs: { label: string; path: string }[] = [{ label: "Home", path: "/" }];

  if (isTenantDetail) {
    crumbs.push({ label: "Tenants", path: "/tenants" });
    crumbs.push({ label: "Tenant Details", path: location.pathname });
  } else {
    let currentPath = "";
    segments.forEach((seg) => {
      currentPath += `/${seg}`;
      const key = currentPath.slice(1);
      crumbs.push({ label: routeLabels[key] || seg, path: currentPath });
    });
  }

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {i === crumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <Breadcrumbs />
      </div>
      {children && <div className="flex items-center gap-2 mt-2 sm:mt-0">{children}</div>}
    </div>
  );
}
