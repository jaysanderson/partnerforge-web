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
  type: 'submenu';
  label: string;
  icon: IconType;
  items: NavItem[];
  defaultOpen?: boolean;
}

/** A section heading with its children (leaves or submenus). */
export interface NavSection {
  label?: string;
  items: (NavItem | NavSubmenu)[];
}

interface AppShellProps {
  brand: string;
  brandSub?: string;
  nav: NavItem[] | NavSection[];
  activeKey: string;
  onNavigate: (key: string) => void;
  topBar?: ReactNode;
  children: ReactNode;
  /**
   * Optional card pinned at the bottom of the sidebar above the Collapse
   * toggle. Used to show user / role / tier chip — wired from
   * `apps/{console,portal}/src/App.tsx`. Hidden when sidebar collapsed.
   */
  userCard?: ReactNode;
}

function isSectioned(nav: NavItem[] | NavSection[]): nav is NavSection[] {
  return nav.length > 0 && 'items' in nav[0]!;
}

function isSubmenu(it: NavItem | NavSubmenu): it is NavSubmenu {
  return 'type' in it && it.type === 'submenu';
}

/**
 * Light sidebar (Linear / Vercel / Attio convention). 240 px wide,
 * collapsible to 64 px. White surface with 1 px border. Active nav row
 * gets a soft subtle background + a 2 px brand-coloured left accent.
 * Icons are monochrome by default and only colour on active.
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
  const w = collapsed ? 64 : 240;

  return (
    <div className="flex h-full bg-canvas">
      {/* Skip-to-content: hidden until focused via Tab. WCAG 2.4.1. */}
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-brand-600 px-3 py-2 text-[13px] font-medium text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:outline-none focus:shadow-[var(--shadow-ring)]"
      >
        Skip to main content
      </a>
      <aside
        className="flex flex-col border-r border-border bg-surface transition-[width] duration-200"
        style={{ width: w, minWidth: w }}
      >
        {/* Brand strip */}
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))',
              fontSize: 13,
            }}
            aria-hidden
          >
            P
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[14px] font-semibold text-ink-1">{brand}</div>
              {brandSub && (
                <div className="mt-0.5 truncate text-[11px] text-ink-3">{brandSub}</div>
              )}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
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
            <div className="space-y-px">
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

        {/* User card */}
        {userCard && !collapsed && (
          <div className="border-t border-border bg-surface px-2 py-2">{userCard}</div>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-9 items-center justify-center border-t border-border text-ink-3 transition-colors hover:bg-subtle hover:text-ink-1"
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </aside>

      {/* Right column: header + main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
          {topBar}
        </header>
        <main id="main" className="flex-1 overflow-auto bg-canvas" tabIndex={-1}>
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
    <div className="mb-3 space-y-px">
      {section.label && !collapsed && (
        <div className="pf-micro px-3 pb-1 pt-3 text-ink-3">
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
      href={item.key}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        onNavigate(item.key);
      }}
      title={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
      className={`group relative flex w-full items-center gap-2.5 rounded-md py-1.5 text-[13px] transition-colors focus-visible:outline-none ${
        indented && !collapsed ? 'pl-8 pr-3' : 'px-2.5'
      } ${
        active
          ? 'bg-subtle font-semibold text-ink-1'
          : 'text-ink-2 hover:bg-subtle hover:text-ink-1'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r"
          style={{ background: 'var(--color-brand-600)' }}
        />
      )}
      <Icon size={16} />
      {!collapsed && (
        <>
          <span className="truncate flex-1 text-left">{item.label}</span>
          {item.badge != null && item.badge !== '' && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-ink-2">
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
        className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:bg-subtle hover:text-ink-1 ${
          collapsed ? 'justify-center' : ''
        } ${childActive ? 'font-semibold text-ink-1' : ''}`}
      >
        <Icon size={16} />
        {!collapsed && (
          <>
            <span className="truncate flex-1 text-left">{submenu.label}</span>
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="mt-px space-y-px">
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
