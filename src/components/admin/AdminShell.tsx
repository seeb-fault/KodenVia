"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  Wrench,
  Sparkles,
  Link2,
  MessageSquareQuote,
  HelpCircle,
  Quote,
  Settings,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BrandInitialsAvatar } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Empresa", icon: User },
  { href: "/admin/projects", label: "Proyectos", icon: FolderGit2 },
  { href: "/admin/experiences", label: "Trayectoria", icon: Briefcase },
  { href: "/admin/skills", label: "Tecnologías", icon: Wrench },
  { href: "/admin/services", label: "Servicios", icon: Sparkles },
  { href: "/admin/social-links", label: "Redes y contacto", icon: Link2 },
  { href: "/admin/testimonials", label: "Testimonios", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "Preguntas frecuentes", icon: HelpCircle },
  { href: "/admin/taglines", label: "Lemas", icon: Quote },
];

function NavLinks({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition",
              collapsed ? "justify-center px-2" : "px-3",
              active
                ? "bg-foreground/8 text-foreground"
                : "text-muted hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-md",
                active ? "bg-(image:--gradient-brand) text-white" : "text-muted",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </span>
            {collapsed ? null : item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Top-bar avatar with a dropdown menu containing the user identity + logout. */
function UserMenu({
  userName,
  userImage,
  logoutAction,
}: {
  userName: string;
  userImage: string | null;
  logoutAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de cuenta"
        onClick={() => setOpen((o) => !o)}
        className="focus-visible:ring-ring rounded-full transition hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
      >
        <BrandInitialsAvatar name={userName} src={userImage} className="size-8" />
      </button>

      {open ? (
        <div
          role="menu"
          className="border-border bg-background absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border shadow-lg"
        >
          <div className="border-border flex items-center gap-3 border-b px-3 py-3">
            <BrandInitialsAvatar name={userName} src={userImage} className="size-9" />
            <div className="min-w-0">
              <div className="text-foreground truncate text-sm font-medium">{userName}</div>
              <div className="text-muted text-xs">Administrador</div>
            </div>
          </div>
          <Link
            href="/admin/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="text-foreground hover:bg-foreground/5 border-border flex w-full items-center gap-2 border-b px-3 py-2.5 text-sm transition"
          >
            <Settings className="size-4" aria-hidden />
            Configuración
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="text-foreground hover:bg-foreground/5 flex w-full items-center gap-2 px-3 py-2.5 text-sm transition"
            >
              <LogOut className="size-4" aria-hidden />
              Cerrar sesión
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function AdminShell({
  userName,
  userImage,
  logoutAction,
  children,
}: {
  userName: string;
  userImage: string | null;
  logoutAction: () => void;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate the collapsed preference from localStorage after mount. Server and
  // first client paint render expanded (so SSR matches and there's no hydration
  // mismatch); once mounted we apply the persisted preference.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- intentional post-mount
       hydration of a persisted UI preference; gated by `mounted` so SSR matches. */
    setMounted(true);
    if (localStorage.getItem("admin:sidebar-collapsed") === "1") setCollapsed(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("admin:sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  // Only let `collapsed` affect layout after mount to avoid an SSR/client
  // hydration mismatch on the sidebar width.
  const isCollapsed = mounted && collapsed;
  const sidebarWidth = isCollapsed ? "lg:w-16" : "lg:w-64";
  const mainPad = isCollapsed ? "lg:pl-16" : "lg:pl-64";

  return (
    <div className="bg-background min-h-screen">
      {/* ── Full-width top bar ──────────────────────────────────────────── */}
      <header className="border-border bg-background/80 fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-3 border-b px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            aria-label="Abrir menú"
            onClick={() => setMobileOpen(true)}
            className="text-muted hover:text-foreground lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-2"
            aria-label="Inicio del administrador"
          >
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "border-border text-foreground hover:bg-foreground/5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            )}
          >
            <ExternalLink className="size-4" aria-hidden />
            <span className="hidden sm:inline">Ver sitio</span>
          </Link>
          <UserMenu userName={userName} userImage={userImage} logoutAction={logoutAction} />
        </div>
      </header>

      {/* ── Desktop sidebar (below the top bar) ─────────────────────────── */}
      <aside
        className={cn(
          "border-border bg-surface fixed top-14 bottom-0 left-0 hidden flex-col border-r p-3 transition-[width] duration-200 lg:flex",
          sidebarWidth,
        )}
      >
        <NavLinks collapsed={isCollapsed} />
        {/* In-sidebar collapse/expand toggle */}
        <div className="border-border mt-auto border-t pt-2">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
            title={isCollapsed ? "Expandir" : "Contraer"}
            className={cn(
              "text-muted hover:bg-foreground/5 hover:text-foreground flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium transition",
              isCollapsed ? "justify-center px-2" : "px-3",
            )}
          >
            {isCollapsed ? (
              <PanelLeft className="size-5 shrink-0" aria-hidden />
            ) : (
              <PanelLeftClose className="size-5 shrink-0" aria-hidden />
            )}
            {isCollapsed ? null : "Contraer"}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="border-border bg-background absolute inset-y-0 left-0 flex w-64 flex-col border-r p-4">
            <div className="mb-6 flex items-center justify-between px-2">
              <Link
                href="/admin"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
                aria-label="Inicio del administrador"
              >
                <Logo />
              </Link>
              <button
                aria-label="Cerrar menú"
                onClick={() => setMobileOpen(false)}
                className="text-muted hover:text-foreground"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <div className="border-border mt-auto border-t pt-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-muted hover:bg-foreground/5 hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition"
              >
                <ExternalLink className="size-4" aria-hidden />
                Ver sitio
              </Link>
            </div>
          </aside>
        </div>
      ) : null}

      {/* ── Main column ─────────────────────────────────────────────────── */}
      <div className={cn("pt-14 transition-[padding] duration-200", mainPad)}>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
