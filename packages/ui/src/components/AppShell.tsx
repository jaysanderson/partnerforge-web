import { useState, type ComponentType, type ReactElement, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

type IconType = ComponentType<{ size?: number | string }>;

/** A flat clickable nav entry. */
export interface NavItem {
  key: string;
  label: string;
  icon: IconType;
  /** Optional badge text or count (e.g. pending count, "New"). */
  badge?: string | number;
}

/** A collapsible submenu inside a section. */
export interface NavSubmenu {
  /** Discriminator. */
  type: 'submenu';
  label: string;
  icon: IconType;
  items: NavItem[];
  /** Start expanded. Defaults to false. */
  defaultOpen?: boolean;
}

/** A section heading with its children (leaves or submenus). */
export interface NavSection {
  /** Section label (uppercase small caps); omit for an un-titled group. */
  label?: string;
  items: (NavItem | NavSubmenu)[];
}

interface AppShellProps {
  brand: string;
  /** Small line under the brand, e.g. "Partner Experience Platform". */
  brandSub?: string;
  /** Either a flat list (legacy) or section-grouped (new). */
  nav: NavItem[] | NavSection[];
  activeKey: string;
  onNavigate: (key: string) => void;
  topBar?: ReactNode;
  children: ReactNode;
  /**
   * Optional card pinned at the bottom of the sidebar above the Collapse
   * toggle. Used to show a user avatar / role / tier chip — see
   * `apps/{console,portal}/src/App.tsx` for the rendered shape.
   * Hidden when the sidebar is collapsed.
   */
  userCard?: ReactNode;
}

function isSectioned(nav: NavItem[] | NavSection[]): nav is NavSection[] {
  // Sections expose `items`; NavItems expose `key`.
  return nav.length > 0 && 'items' in nav[0]!;
}

function isSubmenu(it: NavItem | NavSubmenu): it is NavSubmenu {
  return 'type' in it && it.type === 'submenu';
}

/**
 * Internal console / portal layout shell. Fixed Progress-dark sidebar
 * (256px, collapsible to 68px), 56px white top bar, light content area.
 * Content fills available width (enterprise wide monitors) with a sensible
 * reading max so it never sprawls or cramps.
 */
export function AppShell({
  brand,
  brandSub,
  nav,
  activeKey,
  onNavigate,
  topBar,
  children,
  userCard,
}: AppShellProps): ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? 68 : 256;

  return (
    <div className="flex h-full">
      {/* Skip-to-content: hidden until focused via Tab. WCAG 2.4.1.
          Lands the user past the nav into the main content area. */}
      <a
        href="#main"
        className="sr-only z-50 rounded-[var(--radius-control)] bg-progress-blue px-3 py-2 text-small font-medium text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:outline-none focus:ring-2 focus:ring-progress-blue focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <aside
        className="flex flex-col bg-sidebar-bg text-sidebar-text transition-[width] duration-200"
        style={{ width: w, minWidth: w }}
      >
        <div className="flex h-14 items-center gap-2.5 px-4">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-card)] bg-progress-green font-heading text-[15px] font-bold text-text-on-green">
            P
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-heading text-[15px] font-semibold">{brand}</div>
              {brandSub && (
                <div className="text-[11px] tracking-wide text-sidebar-muted">{brandSub}</div>
              )}
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {isSectioned(nav) ? (
            nav.map((section, sIdx) => (
              <Section
                key={section.label ?? `section-${sIdx}`}
                section={section}
                activeKey={activeKey}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))
          ) : (
            <div className="space-y-0.5">
              {nav.map((item) => (
                <Leaf
                  key={item.key}
                  item={item}
                  active={item.key === activeKey}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </nav>

        {userCard && !collapsed && (
          <div className="border-t border-white/10 px-3 py-3">{userCard}</div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className={`flex items-center gap-2 border-t border-white/10 px-4 py-3 text-small text-sidebar-muted hover:text-sidebar-text ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {topBar}
        </header>
        <main id="main" className="flex-1 overflow-auto bg-background" tabIndex={-1}>
          <div className="mx-auto w-full max-w-[1440px] px-6 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface SectionProps {
  section: NavSection;
  activeKey: string;
  collapsed: boolean;
  onNavigate: (key: string) => void;
}

function Section({ section, activeKey, collapsed, onNavigate }: SectionProps): ReactElement {
  return (
    <div className="mb-4 space-y-0.5">
      {section.label && !collapsed && (
        <div className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted/70">
          {section.label}
        </div>
      )}
      {section.items.map((item) =>
        isSubmenu(item) ? (
          <Submenu
            key={item.label}
            submenu={item}
            activeKey={activeKey}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ) : (
          <Leaf
            key={item.key}
            item={item}
            active={item.key === activeKey}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ),
      )}
    </div>
  );
}

interface LeafProps {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate: (key: string) => void;
  /** Indent for submenu children (already inside an expanded submenu). */
  indented?: boolean;
}

function Leaf({ item, active, collapsed, onNavigate, indented }: LeafProps): ReactElement {
  const Icon = item.icon;
  return (
    <a
      // Real href so right-click → "Open in new tab" works, plus better
      // screen-reader semantics than <button>. SPA nav intercepts the
      // click; cmd/ctrl/middle-click fall through to the browser.
      href={item.key}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        onNavigate(item.key);
      }}
      title={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-[var(--radius-card)] py-2 text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-progress-blue focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg ${
        indented && !collapsed ? 'pl-9 pr-3' : 'px-3'
      } ${
        active
          ? 'bg-white/10 font-semibold text-sidebar-text'
          : 'text-sidebar-muted hover:bg-white/5 hover:text-sidebar-text'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-progress-green" />
      )}
      <Icon size={18} />
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left">{item.label}</span>
          {item.badge != null && item.badge !== '' && (
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums">
              {item.badge}
            </span>
          )}
        </>
      )}
    </a>
  );
}

interface SubmenuProps {
  submenu: NavSubmenu;
  activeKey: string;
  collapsed: boolean;
  onNavigate: (key: string) => void;
}

function Submenu({ submenu, activeKey, collapsed, onNavigate }: SubmenuProps): ReactElement {
  const childActive = submenu.items.some((c) => c.key === activeKey);
  const [open, setOpen] = useState<boolean>(childActive || !!submenu.defaultOpen);
  const Icon = submenu.icon;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={collapsed ? submenu.label : undefined}
        className={`flex w-full items-center gap-3 rounded-[var(--radius-card)] px-3 py-2 text-small text-sidebar-muted transition-colors hover:bg-white/5 hover:text-sidebar-text ${
          collapsed ? 'justify-center' : ''
        } ${childActive ? 'font-semibold text-sidebar-text' : ''}`}
      >
        <Icon size={18} />
        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left">{submenu.label}</span>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="mt-0.5 space-y-0.5">
          {submenu.items.map((it) => (
            <Leaf
              key={it.key}
              item={it}
              active={it.key === activeKey}
              collapsed={collapsed}
              onNavigate={onNavigate}
              indented
            />
          ))}
        </div>
      )}
    </div>
  );
}
