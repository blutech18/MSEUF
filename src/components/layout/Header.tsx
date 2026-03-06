"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SITE_CONFIG,
  NAV_ITEMS,
  ABOUT_ITEMS,
  SERVICE_ITEMS,
  COLLECTION_ITEMS,
  FORM_ITEMS,
} from "@/lib/constants";
import { useChatStore } from "@/stores/chatStore";

interface DropdownGroup {
  label: string;
  items: readonly { label: string; href: string; external?: boolean }[];
}

const dropdownGroups: DropdownGroup[] = [
  { label: "About Us", items: ABOUT_ITEMS },
  { label: "Library Sections", items: SERVICE_ITEMS },
  { label: "Collections", items: COLLECTION_ITEMS },
  { label: "Online Forms", items: FORM_ITEMS },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const toggleChat = useChatStore((s) => s.toggleChat);

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* ── Brand bar ── */}
      <div className="bg-maroon-800">
        <div className="container-page flex items-center justify-between py-3">
          {/* Logo + Name */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="MSEUF University Libraries"
              width={52}
              height={52}
              className="h-13 w-13 shrink-0 rounded-full"
              priority
            />
            <div>
              <p className="font-heading text-base font-bold leading-snug text-white sm:text-lg">
                MSEUF University Libraries
              </p>
              <p className="text-xs text-maroon-300">
                Manuel S. Enverga University Foundation
              </p>
            </div>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-md p-1.5 text-white/70 transition-colors hover:text-white"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/dashboard/login"
              className="hidden rounded-md p-1.5 text-white/70 transition-colors hover:text-white sm:inline-flex"
              aria-label="Staff login"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="rounded-md p-1.5 text-white/70 transition-colors hover:text-white lg:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable search bar */}
        {searchOpen && (
          <div className="border-t border-maroon-700 bg-maroon-950 px-4 py-3">
            <div className="container-page">
              <input
                autoFocus
                type="search"
                placeholder="Search books, resources, services..."
                className="w-full rounded-lg border border-maroon-600 bg-maroon-800 px-4 py-2.5 text-sm text-white placeholder-maroon-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Nav bar (desktop) ── */}
      <div className="hidden bg-maroon-950 lg:block">
        <div className="container-page">
          <nav className="flex items-center">
            {/* Plain links */}
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "border-gold-400 text-gold-300"
                    : "text-maroon-200 hover:text-gold-300"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdown groups */}
            {dropdownGroups.map((group) => {
              const isActive = group.items.some((item) => item.href === pathname);

              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(group.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "border-gold-400 text-gold-300"
                        : "text-maroon-200 hover:text-gold-300"
                    )}
                  >
                    {group.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        openDropdown === group.label && "rotate-180"
                      )}
                    />
                  </button>

                  {openDropdown === group.label && (
                    <div className="absolute left-0 top-full z-50 w-72 bg-maroon-950 py-1.5 shadow-xl">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          target={
                            "external" in item && item.external
                              ? "_blank"
                              : undefined
                          }
                          className={cn(
                            "block px-5 py-2.5 text-sm transition-colors",
                            pathname === item.href
                              ? "text-gold-300"
                              : "text-maroon-200 hover:text-gold-300"
                          )}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div className="bg-maroon-950 lg:hidden">
          <div className="container-page py-3">
            {/* Plain nav items */}
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block border-b border-maroon-800 py-3 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-gold-300"
                    : "text-maroon-300 hover:text-gold-300"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Dropdown groups */}
            {dropdownGroups.map((group) => (
              <div key={group.label} className="border-b border-maroon-800">
                <p className="py-2 pt-4 text-xs font-semibold uppercase tracking-widest text-maroon-500">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block py-2.5 pl-4 text-sm transition-colors",
                      pathname === item.href
                        ? "text-gold-300"
                        : "text-maroon-300 hover:text-gold-300"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}

            {/* Bottom actions */}
            <div className="flex flex-col gap-1 py-4">
              <Link
                href="/dashboard/login"
                className="py-2 text-sm font-medium text-maroon-300 transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
