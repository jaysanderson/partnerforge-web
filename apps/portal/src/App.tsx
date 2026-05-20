import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { AppShell, type NavItem } from '@partnerforge/ui';
import { useAuth } from './auth';
import { useI18n, LOCALES } from './i18n';
import { useApi } from './api/hooks';
import { SignIn } from './components/SignIn';
import { Dashboard } from './pages/Dashboard';
import { Opportunities, OpportunityDetail } from './pages/Opportunities';
import { Forms } from './pages/Forms';
import { Assets } from './pages/Assets';
import { Quotes } from './pages/Quotes';
import { Library } from './pages/Library';
import { Agent } from './pages/Agent';
import { Training } from './pages/Training';

const NAV_BASE: { key: string; label: string; icon: NavItem['icon'] }[] = [
  { key: '/', label: 'Dashboard', icon: LayoutDashboard },
  { key: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { key: '/forms', label: 'Forms & Requests', icon: ClipboardList },
  { key: '/assets', label: 'Assets & Renewals', icon: KeyRound },
  { key: '/quotes', label: 'Quotes', icon: FileText },
  { key: '/library', label: 'Content Library', icon: BookOpen },
  { key: '/assistant', label: 'AI Assistant', icon: Sparkles },
  { key: '/training', label: 'Training', icon: GraduationCap },
];

export function App() {
  const { contact, signOut } = useAuth();
  const { t, locale, setLocale, translating } = useI18n();
  const modeQ = useApi.adminConfig.mode();
  const location = useLocation();
  const navigate = useNavigate();

  if (!contact) return <SignIn />;

  const NAV: NavItem[] = NAV_BASE.map((n) => ({
    key: n.key,
    label: t(n.label),
    icon: n.icon,
  }));
  const mode = modeQ.data?.mode ?? 'demo';

  const activeKey =
    NAV.slice()
      .reverse()
      .find((n) => location.pathname.startsWith(n.key) && n.key !== '/')?.key ?? '/';

  return (
    <AppShell
      brand="Partner Portal"
      brandSub="Progress Partner Network"
      nav={NAV}
      activeKey={activeKey}
      onNavigate={(k) => navigate(k)}
      topBar={
        <>
          <div className="flex items-center gap-3 text-small text-text-secondary">
            <span>{t('Progress Partner Network')}</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-2 py-0.5 text-caption text-text-secondary"
              title={
                mode === 'live'
                  ? 'Live mode — real connectors'
                  : 'Demo mode — mock Salesforce/SharePoint data'
              }
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  mode === 'live' ? 'bg-success' : 'bg-warning'
                }`}
              />
              {mode === 'live' ? 'Live' : 'Demo'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {translating && (
              <span className="text-caption text-text-secondary">{t('Translating…')}</span>
            )}
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as typeof locale)}
              aria-label="Language"
              className="rounded-[var(--radius-control)] border border-border px-2 py-1 text-caption"
            >
              {Object.entries(LOCALES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              aria-label={t('Help')}
              title={t('Help & API docs')}
              className="rounded-full p-1.5 text-text-secondary hover:bg-surface-alt hover:text-text-primary"
            >
              <HelpCircle size={16} />
            </a>
            <span className="text-small">{contact.name}</span>
            <button
              type="button"
              onClick={signOut}
              aria-label={t('Sign out')}
              className="text-text-secondary hover:text-danger"
            >
              <LogOut size={16} />
            </button>
          </div>
        </>
      }
    >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/library" element={<Library />} />
        <Route path="/assistant" element={<Agent />} />
        {/* Friendly redirects for the AI surface — non-developers guess these
            URLs; bouncing them to /assistant beats a 404. UX audit catch. */}
        <Route path="/ai" element={<Navigate to="/assistant" replace />} />
        <Route path="/ai/ask" element={<Navigate to="/assistant" replace />} />
        <Route path="/copilot" element={<Navigate to="/assistant" replace />} />
        <Route path="/training" element={<Training />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </AppShell>
  );
}
