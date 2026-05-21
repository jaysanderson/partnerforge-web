import { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  BarChart3,
  Briefcase,
  ClipboardList,
  DollarSign,
  FilePlus2,
  FileText,
  Folder,
  GitBranch,
  GraduationCap,
  HelpCircle,
  Home,
  KeyRound,
  LogOut,
  Megaphone,
  Palette,
  Plug,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wrench,
} from 'lucide-react';
import { useIsFetching } from '@tanstack/react-query';
import { AppShell, EmptyState, TopProgress, type NavSection } from '@partnerforge/ui';
import { useAuth } from './auth';
import { useApi } from './api/hooks';
import { Login } from './components/Login';
import { CopilotPanel } from './components/CopilotPanel';
import { CommandPalette } from './components/CommandPalette';
import { Dashboard } from './pages/Dashboard';
import { Partners } from './pages/Partners';
import { PartnerDetail } from './pages/PartnerDetail';
import { Deals } from './pages/Deals';
import { Content } from './pages/Content';
import { Reports } from './pages/Reports';
import { Approvals } from './pages/Approvals';
import { AdminConfig } from './pages/AdminConfig';
import { ApiKeys } from './pages/ApiKeys';
import { Audit } from './pages/Audit';
import { Operations } from './pages/Operations';
import { SfConnection } from './pages/sf/Connection';
import { SfSyncStatus } from './pages/sf/SyncStatus';
import { SfRunSync } from './pages/sf/RunSync';
import { SfFieldMappings } from './pages/sf/FieldMappings';
import { SfConflicts } from './pages/sf/Conflicts';
import {
  CommissionPlans,
  CommissionPayouts,
  CommissionStatements,
  CommissionDisputes,
} from './pages/programs/Commissions';
import { Tiers } from './pages/programs/Tiers';
import { Journeys } from './pages/programs/Journeys';
import { Mdf } from './pages/programs/Mdf';
import { Goals } from './pages/programs/Goals';
import { Training } from './pages/programs/Training';

/**
 * Console nav, grouped by what staff actually do day-to-day.
 *
 * Top — high-frequency operational work (Home, Partners, Opps, Submissions).
 * Programs — partner-success programs that span weeks (Journeys, Goals,
 *            MDF, training, commissions).
 * Configure — admin & integrations (Tiers, Forms builder, theming, SF
 *             integration, API keys).
 * Operations — ops/audit (Reports, Audit, manual sync triggers + SF cache).
 *
 * Endpoints labelled in placeholder pages are the public REST surface from
 * PR6 — staff can see "this UI is just a call to the API."
 */
const NAV: NavSection[] = [
  {
    items: [
      { key: '/', label: 'Home', icon: Home },
      { key: '/partners', label: 'Partners', icon: Users },
      { key: '/opportunities', label: 'Opportunities', icon: Briefcase },
      { key: '/submissions', label: 'Submissions', icon: ShieldCheck },
      { key: '/assets', label: 'Assets', icon: Folder },
    ],
  },
  {
    label: 'Programs',
    items: [
      { key: '/journeys', label: 'Journeys', icon: GitBranch },
      { key: '/training', label: 'Courses & Certificates', icon: GraduationCap },
      { key: '/goals', label: 'Goals', icon: Target },
      { key: '/mdf', label: 'MDF', icon: Megaphone },
      {
        type: 'submenu',
        label: 'Commissions',
        icon: DollarSign,
        items: [
          { key: '/commissions/plans', label: 'Plans', icon: ClipboardList },
          { key: '/commissions/payouts', label: 'Payouts', icon: FileText },
          { key: '/commissions/statements', label: 'Statements', icon: FilePlus2 },
          { key: '/commissions/disputes', label: 'Disputes', icon: ShieldCheck },
        ],
      },
    ],
  },
  {
    label: 'Configure',
    items: [
      { key: '/tiers', label: 'Tiers', icon: Award },
      { key: '/forms', label: 'Forms', icon: ClipboardList },
      { key: '/experience', label: 'Experience builder', icon: Palette },
      { key: '/portal-settings', label: 'Portal settings', icon: Settings },
      {
        type: 'submenu',
        label: 'Salesforce',
        icon: Plug,
        items: [
          { key: '/sf/connection', label: 'Connection', icon: Plug },
          { key: '/sf/sync', label: 'Sync status', icon: ClipboardList },
          { key: '/sf/run', label: 'Run sync', icon: Wrench },
          { key: '/sf/mappings', label: 'Field mappings', icon: FileText },
          { key: '/sf/conflicts', label: 'Conflict queue', icon: ShieldCheck },
        ],
      },
      { key: '/api-keys', label: 'API & integrations', icon: KeyRound },
    ],
  },
  {
    label: 'Operations',
    items: [
      { key: '/reports', label: 'Reports', icon: BarChart3 },
      { key: '/audit', label: 'Audit', icon: ScrollText },
      { key: '/ops', label: 'Operations', icon: Wrench },
    ],
  },
];

/** Flat list of every leaf key — used to resolve the active route reliably. */
function allKeys(sections: NavSection[]): string[] {
  const out: string[] = [];
  for (const s of sections) {
    for (const it of s.items) {
      if ('type' in it) {
        for (const c of it.items) out.push(c.key);
      } else {
        out.push(it.key);
      }
    }
  }
  return out;
}

const ALL_KEYS = allKeys(NAV);

export function App() {
  const { user, logout } = useAuth();
  const [copilot, setCopilot] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const modeQ = useApi.adminConfig.mode();
  const location = useLocation();
  const navigate = useNavigate();

  // ⌘J / Ctrl+J opens the ARAG copilot from anywhere. ⌘K is already
  // wired by CommandPalette. Both bindings are reflected in the help menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setCopilot((c) => !c);
      }
      if (e.key === 'Escape' && helpOpen) setHelpOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [helpOpen]);

  // Track any pending react-query fetch (>0 → show the top progress bar).
  // Hook must run before the conditional Login return; React rules-of-hooks.
  const isFetching = useIsFetching();

  if (!user) return <Login />;
  const mode = modeQ.data?.mode ?? 'demo';

  const activeKey =
    [...ALL_KEYS]
      // Sort longest-first so /commissions/plans wins over a hypothetical /commissions.
      .sort((a, b) => b.length - a.length)
      .find((k) => location.pathname === k || location.pathname.startsWith(`${k}/`)) ?? '/';

  return (
    <>
      <TopProgress loading={isFetching > 0} />
      <AppShell
        brand="PartnerForge"
        brandSub="Internal Console"
        nav={NAV}
        activeKey={activeKey}
        onNavigate={(k) => navigate(k)}
        userCard={
          <div className="flex items-center gap-2.5 rounded-md p-1.5 transition-colors hover:bg-subtle">
            <div
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white"
              style={{
                background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))',
                fontWeight: 600,
                fontSize: 11,
              }}
              aria-hidden
            >
              {user.name
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-ink-1">{user.name}</div>
              <div className="truncate text-[11px] text-ink-3">{user.role}</div>
            </div>
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              className="rounded-md p-1 text-ink-3 transition-colors hover:bg-muted hover:text-ink-1"
            >
              <LogOut size={14} />
            </button>
          </div>
        }
        topBar={
          <>
            <div className="flex items-center gap-3 text-small">
              {/* Semantic env chip — amber for Demo (real semantic colour,
                  not a grey dot), neutral for Live. Clickable: a single
                  click takes a staff user to the mode switch on Portal
                  Settings. Previously this was informational-only and
                  users had to shell into the Fly machine to flip mode. */}
              <Link
                to="/portal-settings"
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-caption font-semibold uppercase tracking-wide transition-opacity hover:opacity-80 ${
                  mode === 'live'
                    ? 'bg-success/15 text-success'
                    : 'bg-warning/15 text-warning'
                }`}
                title={
                  mode === 'live'
                    ? 'Live mode — click to change'
                    : 'Demo mode — click to change'
                }
              >
                {mode === 'live' ? 'Live' : 'Demo'}
              </Link>
            </div>
            {/* Centered ⌘K search pill — was left-aligned, now claims the
                centre of the chrome the way Linear / Stripe / Notion do.
                Constrained to ~480px so it doesn't sprawl on wide monitors. */}
            <div className="pointer-events-none absolute inset-x-0 mx-auto flex w-full max-w-[480px] justify-center px-6">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('pf:command-palette:open'))
                }
                className="pointer-events-auto flex w-full items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-small text-text-secondary transition-colors hover:border-text-secondary hover:text-text-primary"
              >
                <Search size={14} />
                <span className="flex-1 text-left">Search partners, deals, content…</span>
                <kbd className="rounded border border-border px-1 font-mono text-[10px]">
                  ⌘K
                </kbd>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCopilot(true)}
                title="Ask ARAG (⌘J)"
                className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-progress-blue px-3 py-1.5 text-small font-medium text-white hover:bg-progress-blue/90"
              >
                <Sparkles size={14} />
                Ask ARAG
                <kbd className="ml-1 rounded bg-white/15 px-1 font-mono text-[10px]">⌘J</kbd>
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setHelpOpen((o) => !o)}
                  aria-label="Help"
                  aria-haspopup="menu"
                  aria-expanded={helpOpen}
                  className="rounded-full p-1.5 text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                >
                  <HelpCircle size={16} />
                </button>
                {helpOpen && (
                  <div
                    role="menu"
                    onMouseLeave={() => setHelpOpen(false)}
                    className="absolute right-0 top-full z-40 mt-1 w-64 rounded-[var(--radius-card)] border border-border bg-surface p-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                  >
                    <div className="px-2 py-1 text-caption font-semibold uppercase tracking-wide text-text-secondary">
                      Keyboard
                    </div>
                    <div className="space-y-0.5 px-2 py-1 text-small">
                      <div className="flex items-center justify-between">
                        <span>Search</span>
                        <kbd className="rounded border border-border px-1 font-mono text-[10px]">⌘K</kbd>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Ask ARAG</span>
                        <kbd className="rounded border border-border px-1 font-mono text-[10px]">⌘J</kbd>
                      </div>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <a
                      href="/docs"
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded px-2 py-1.5 text-small hover:bg-surface-alt"
                    >
                      API documentation
                    </a>
                    <a
                      href="https://github.com/jaysanderson/partner-forge"
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded px-2 py-1.5 text-small hover:bg-surface-alt"
                    >
                      What's new (GitHub)
                    </a>
                  </div>
                )}
              </div>
              <span className="text-small">
                {user.name}{' '}
                <span className="text-caption text-text-secondary">({user.role})</span>
              </span>
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                className="text-text-secondary hover:text-danger"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        }
      >
        <Routes>
          {/* Live pages — renamed routes match the new menu labels. */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/partners/:id" element={<PartnerDetail />} />
          <Route path="/opportunities" element={<Deals />} />
          {/* Backwards compat: old /deals deep-links keep working. */}
          <Route path="/deals" element={<Deals />} />
          <Route path="/assets" element={<Content />} />
          <Route path="/content" element={<Content />} />
          <Route path="/submissions" element={<Approvals />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/portal-settings" element={<AdminConfig />} />
          <Route path="/config" element={<AdminConfig />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audit" element={<Audit />} />

          {/* Programs — real pages backed by the readers added in PR11. */}
          <Route path="/journeys" element={<Journeys />} />
          <Route path="/training" element={<Training />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/mdf" element={<Mdf />} />
          <Route path="/commissions/plans" element={<CommissionPlans />} />
          <Route path="/commissions/payouts" element={<CommissionPayouts />} />
          <Route path="/commissions/statements" element={<CommissionStatements />} />
          <Route path="/commissions/disputes" element={<CommissionDisputes />} />
          <Route path="/tiers" element={<Tiers />} />

          {/* Forms builder + Experience builder need real schema work; both
              land in PR_UX5 / a later milestone. Until then, render a proper
              product-shaped "coming soon" page rather than a backend-leaky
              Placeholder — no /trpc/... paths visible to staff. */}
          <Route
            path="/forms"
            element={
              <div className="space-y-6">
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Configure
                  </div>
                  <h1 className="font-heading text-h1 font-semibold">Forms builder</h1>
                  <p className="mt-1 max-w-2xl text-body text-text-secondary">
                    Author the forms partners see in the portal — deal registration,
                    MDF requests, support tickets — with fields, validation, and
                    routing rules.
                  </p>
                </div>
                <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-card)]">
                  <EmptyState
                    variant="coming-soon"
                    icon={ClipboardList}
                    title="Forms builder lands next milestone"
                    body="Partners already submit through the live deal-reg, MDF, and support forms in the portal. The builder UI for authoring new form definitions ships in the next release."
                    action={{
                      label: 'View live submissions',
                      onClick: () => navigate('/submissions'),
                    }}
                  />
                </div>
              </div>
            }
          />
          <Route
            path="/experience"
            element={
              <div className="space-y-6">
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    Configure
                  </div>
                  <h1 className="font-heading text-h1 font-semibold">Experience builder</h1>
                  <p className="mt-1 max-w-2xl text-body text-text-secondary">
                    Theme and layout the portal per partner tier — branding, which
                    modules show for Gold vs. Silver, what the landing page looks like.
                  </p>
                </div>
                <div className="rounded-[var(--radius-card)] border border-border bg-surface shadow-[var(--shadow-card)]">
                  <EmptyState
                    variant="coming-soon"
                    icon={Palette}
                    title="Experience builder lands next milestone"
                    body="Tiers, journeys, and portal-wide settings are already live — you can shape what partners see today via Tiers + Portal settings. The drag-and-drop experience editor ships in the next release."
                    action={{
                      label: 'Open Tiers',
                      onClick: () => navigate('/tiers'),
                    }}
                    secondaryAction={{
                      label: 'Portal settings',
                      onClick: () => navigate('/portal-settings'),
                    }}
                  />
                </div>
              </div>
            }
          />
          {/* Salesforce sub-menu — real pages. */}
          <Route path="/sf/connection" element={<SfConnection />} />
          <Route path="/sf/sync" element={<SfSyncStatus />} />
          <Route path="/sf/run" element={<SfRunSync />} />
          <Route path="/sf/mappings" element={<SfFieldMappings />} />
          <Route path="/sf/conflicts" element={<SfConflicts />} />
          <Route path="/api-keys" element={<ApiKeys />} />
          <Route path="/ops" element={<Operations />} />

          {/* Fallback */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </AppShell>
      <CommandPalette />
      <CopilotPanel open={copilot} onClose={() => setCopilot(false)} />
    </>
  );
}
