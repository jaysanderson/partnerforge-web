import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
  Home,
  KeyRound,
  LogOut,
  Megaphone,
  Palette,
  Plug,
  ScrollText,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wrench,
} from 'lucide-react';
import { AppShell, type NavSection } from '@partnerforge/ui';
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
import { Placeholder } from './pages/Placeholder';

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
  const modeQ = useApi.adminConfig.mode();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return <Login />;
  const mode = modeQ.data?.mode ?? 'demo';

  const activeKey =
    [...ALL_KEYS]
      // Sort longest-first so /commissions/plans wins over a hypothetical /commissions.
      .sort((a, b) => b.length - a.length)
      .find((k) => location.pathname === k || location.pathname.startsWith(`${k}/`)) ?? '/';

  return (
    <>
      <AppShell
        brand="PartnerForge"
        brandSub="Internal Console"
        nav={NAV}
        activeKey={activeKey}
        onNavigate={(k) => navigate(k)}
        topBar={
          <>
            <div className="flex items-center gap-2 text-small text-text-secondary">
              <span
                className={`rounded-full px-2 py-0.5 text-caption font-semibold uppercase ${
                  mode === 'live' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}
                title={
                  mode === 'live'
                    ? 'Live mode — real Salesforce / SharePoint connectors'
                    : 'Demo mode — mock Salesforce / SharePoint data'
                }
              >
                {mode}
              </span>
              <span className="text-caption">⌘K to search · /docs for API</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCopilot(true)}
                className="flex items-center gap-1.5 rounded-[var(--radius-control)] bg-progress-blue px-3 py-1.5 text-small font-medium text-white"
              >
                <Sparkles size={14} />
                Ask ARAG
              </button>
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

          {/* Placeholder pages — backends exist (or partially); the screens
              are the next implementation pass. Each shows the API endpoints
              it'll call so "the UI is just a call to the API" stays true. */}
          <Route
            path="/journeys"
            element={
              <Placeholder
                title="Journeys"
                group="Programs"
                summary="Partner lifecycle stages (Applied → Approved → Trained → Certified → Producing) and reusable multi-step playbooks staff run with partners."
                endpoints={['GET /v1/partners (stage filter)', 'POST /v1/tasks']}
                icon={GitBranch}
              />
            }
          />
          <Route
            path="/training"
            element={
              <Placeholder
                title="Courses & Certificates"
                group="Programs"
                summary="Author training courses and award certifications. Partners consume these in the portal Training tab."
                endpoints={['GET /trpc/portal.training (today)', 'POST /trpc/courses.* (planned)']}
                icon={GraduationCap}
              />
            }
          />
          <Route
            path="/goals"
            element={
              <Placeholder
                title="Goals"
                group="Programs"
                summary="Per-tier and per-partner performance targets. Track quarterly attainment against pipeline and revenue."
                endpoints={['GET /trpc/goals.* (planned)']}
                icon={Target}
              />
            }
          />
          <Route
            path="/mdf"
            element={
              <Placeholder
                title="Market Development Funds"
                group="Programs"
                summary="Allocate co-marketing budget per partner / campaign, track spend and ROI."
                endpoints={['GET /trpc/campaigns.* (planned)']}
                icon={Megaphone}
              />
            }
          />
          <Route
            path="/commissions/plans"
            element={
              <Placeholder
                title="Commission plans"
                group="Programs → Commissions"
                summary="Define commission structure: tier-based %, product overrides, accelerators."
                endpoints={['GET /trpc/commissions.plans.*']}
                icon={DollarSign}
              />
            }
          />
          <Route
            path="/commissions/payouts"
            element={
              <Placeholder
                title="Payouts"
                group="Programs → Commissions"
                summary="Payout ledger by partner / period. Trigger pay runs."
                endpoints={['GET /trpc/commissions.payouts.*']}
                icon={DollarSign}
              />
            }
          />
          <Route
            path="/commissions/statements"
            element={
              <Placeholder
                title="Per-partner statements"
                group="Programs → Commissions"
                summary="Open statements showing earned-to-date, pending, paid for each partner."
                endpoints={['GET /trpc/commissions.statements.*']}
                icon={DollarSign}
              />
            }
          />
          <Route
            path="/commissions/disputes"
            element={
              <Placeholder
                title="Disputes & adjustments"
                group="Programs → Commissions"
                summary="Partner-raised disputes plus staff adjustments, with full audit trail."
                endpoints={['GET /trpc/commissions.disputes.*']}
                icon={ShieldCheck}
              />
            }
          />
          <Route
            path="/tiers"
            element={
              <Placeholder
                title="Tiers"
                group="Configure"
                summary="Define partner tiers (Registered, Silver, Gold, Platinum, Strategic) — entry rules, benefits, eligible products."
                endpoints={['GET /trpc/adminConfig.tierDefs.* (planned)']}
                icon={Award}
              />
            }
          />
          <Route
            path="/forms"
            element={
              <Placeholder
                title="Forms builder"
                group="Configure"
                summary="Author the forms partners see in the portal (deal reg, MDF requests, support tickets) — fields, validation, routing."
                endpoints={['GET /trpc/adminConfig.formDefs.* (planned)']}
                icon={ClipboardList}
              />
            }
          />
          <Route
            path="/experience"
            element={
              <Placeholder
                title="Experience builder"
                group="Configure"
                summary="Theme + layout per partner tier — what the portal looks like for Gold vs Silver, which modules are visible."
                endpoints={['GET /trpc/adminConfig.experience.* (planned)']}
                icon={Palette}
              />
            }
          />
          <Route
            path="/sf/sync"
            element={
              <Placeholder
                title="Salesforce sync status"
                group="Configure → Salesforce"
                summary="Recent SF cache refreshes, hit rate, last successful API call timestamp per entity."
                endpoints={[
                  'GET /trpc/system.cacheStats (planned)',
                  'POST /v1/system/cache-refresh',
                ]}
                icon={ClipboardList}
              />
            }
          />
          <Route
            path="/sf/run"
            element={
              <Placeholder
                title="Run sync"
                group="Configure → Salesforce"
                summary="Manually trigger a full ARAG sync after a big SF data change."
                endpoints={['POST /v1/system/sync']}
                icon={Wrench}
              />
            }
          />
          <Route
            path="/sf/mappings"
            element={
              <Placeholder
                title="Field mappings"
                group="Configure → Salesforce"
                summary="Which Opportunity / Account fields are visible to partners; per-field labels and edit rights."
                endpoints={['GET /trpc/adminConfig.oppFieldOverrides (today)']}
                icon={FileText}
              />
            }
          />
          <Route
            path="/sf/conflicts"
            element={
              <Placeholder
                title="Conflict queue"
                group="Configure → Salesforce"
                summary="Deals flagged as potential channel conflicts. Resolve or dismiss."
                endpoints={['GET /trpc/deals.conflicts (today)']}
                icon={ShieldCheck}
              />
            }
          />
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
