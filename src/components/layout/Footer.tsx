import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  ExternalLink,
} from "lucide-react";
import {
  SITE_CONFIG,
  ABOUT_ITEMS,
  SERVICE_ITEMS,
  FORM_ITEMS,
  LIBRARY_HOURS,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-maroon-900 text-white">
      <div className="container-page section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="MSEUF University Libraries"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full"
              />
              <div>
                <p className="font-heading text-lg font-bold leading-tight">
                  University Libraries
                </p>
                <p className="text-xs text-maroon-300">MSEUF</p>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-maroon-200">
              The largest library in the Southern Tagalog Region, serving as the
              gateway to Enverga&apos;s academic excellence.
            </p>
            <div className="mt-6 space-y-3 text-sm text-maroon-200">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Enverga University, Lucena City, Quezon Province, Philippines
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(042) 373-7371</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>library@mseuf.edu.ph</span>
              </div>
            </div>
          </div>

          {/* About & Services */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              About & Services
            </h3>
            <ul className="mt-4 space-y-2.5">
              {ABOUT_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-maroon-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-maroon-800 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-maroon-400">
                  Services
                </span>
              </li>
              {SERVICE_ITEMS.slice(0, 3).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-maroon-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Online Forms */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              Online Forms
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FORM_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-maroon-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/follett-destiny"
                  className="flex items-center gap-1.5 text-sm text-maroon-200 transition-colors hover:text-white"
                >
                  Follett Destiny (OPAC)
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorials"
                  className="text-sm text-maroon-200 transition-colors hover:text-white"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-sm text-maroon-200 transition-colors hover:text-white"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Library Hours */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
              Library Hours
            </h3>
            <div className="mt-4 space-y-2.5 text-sm text-maroon-200">
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <div className="space-y-1">
                  <p>{LIBRARY_HOURS.weekdays}</p>
                  <p>{LIBRARY_HOURS.saturday}</p>
                  <p>{LIBRARY_HOURS.sunday}</p>
                </div>
              </div>
              <p className="text-xs italic text-maroon-400">
                {LIBRARY_HOURS.note}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">
                Connect
              </h3>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://facebook.com/MSEUFLibrary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-maroon-200 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="mailto:library@mseuf.edu.ph"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-maroon-200 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-maroon-800">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-maroon-400">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.university}. All
            rights reserved.
          </p>
          <p className="text-xs text-maroon-400">
            AI-Powered Library Support System
          </p>
        </div>
      </div>
    </footer>
  );
}
