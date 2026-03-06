import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="container-page">
        <h1 className="page-header-title">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-lg text-maroon-100">{subtitle}</p>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="page-header-breadcrumb" aria-label="Breadcrumb">
            <Link
              href="/"
              className="flex items-center gap-1 transition-colors hover:text-white"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
