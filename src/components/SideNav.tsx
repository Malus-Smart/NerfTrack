import type { AppStatus, NavKey, UpdateState } from '../domain';
import { useI18n, type MessageKey } from '../i18n';
import { Icon, LogoMark, type IconName } from './Icons';

interface SideNavProps {
  active: NavKey;
  status: AppStatus;
  onNavigate: (key: NavKey) => void;
  updateState: UpdateState;
  onUpdate: () => void;
}

const navItems: Array<{ key: NavKey; labelKey: MessageKey; icon: IconName }> = [
  { key: 'home', labelKey: 'nav.home', icon: 'home' },
  { key: 'setup', labelKey: 'nav.setup', icon: 'settings' },
  { key: 'diagnostics', labelKey: 'nav.diagnostics', icon: 'activity' },
  { key: 'history', labelKey: 'nav.history', icon: 'history' },
  { key: 'settings', labelKey: 'nav.settings', icon: 'settings' },
];

function updateLabelKey(updateState: UpdateState): MessageKey {
  switch (updateState.status) {
    case 'checking':
      return 'update.checking';
    case 'available':
      return 'update.available';
    case 'downloading':
      return 'update.downloading';
    case 'installing':
      return 'update.installing';
    case 'up-to-date':
      return 'update.upToDate';
    case 'failed':
      return 'update.failed';
    case 'not-configured':
      return 'update.notConfigured';
    default:
      return 'update.check';
  }
}

const statusLabelKeys: Record<AppStatus['state'], MessageKey> = {
  connected: 'status.connected',
  detecting: 'status.detecting',
  settling: 'status.settling',
  recalibrating: 'status.recalibrating',
  unsupported: 'status.unsupported',
  needs_setup: 'status.needs_setup',
  error: 'status.error',
};

export function SideNav({ active, status, onNavigate, updateState, onUpdate }: SideNavProps) {
  const { t } = useI18n();
  const isConnected = status.state === 'connected';
  const isBusy = ['checking', 'downloading', 'installing'].includes(updateState.status);
  const updateLabel = t(updateLabelKey(updateState));
  const updateMessage = updateState.latestVersion
    ? t('update.installedVersions', {
        current: updateState.currentVersion,
        latest: updateState.latestVersion,
      })
    : updateState.status === 'failed'
      ? updateState.message
      : updateLabel;
  const statusDetail =
    status.integrationMode === 'gui'
      ? t('status.desktopMode')
      : status.integrationMode === 'cli'
        ? t('status.cliMode')
        : t('status.localMode');
  return (
    <aside className="side-nav">
      <div className="brand" aria-label="NerfTrack">
        <LogoMark size={28} />
        <span>NerfTrack</span>
      </div>
      <nav aria-label={t('nav.primary')}>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${active === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
            aria-current={active === item.key ? 'page' : undefined}
          >
            <Icon name={item.icon} size={23} />
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </nav>
      <div className="side-nav-bottom">
        <button className="connection-card" onClick={() => onNavigate('setup')}>
          <span className={`status-dot ${isConnected ? 'good' : 'warn'}`} />
          <span className="connection-copy">
            <strong>{t(statusLabelKeys[status.state])}</strong>
            <span>{statusDetail}</span>
          </span>
          <Icon name="chevron" size={17} />
        </button>
        <div className="update-control">
          <button
            type="button"
            className={`update-button update-${updateState.status}`}
            disabled={isBusy}
            onClick={onUpdate}
            aria-label={updateLabel}
            title={updateMessage}
          >
            <span className="update-button-label">
              <Icon name="refresh" size={17} />
              {updateLabel}
            </span>
            {updateState.status === 'available' && updateState.latestVersion && (
              <span className="update-badge">v{updateState.latestVersion}</span>
            )}
          </button>
          <span className="update-message" aria-live="polite">
            {updateMessage}
          </span>
        </div>
        <span className="app-version">v{updateState.currentVersion}</span>
      </div>
    </aside>
  );
}
