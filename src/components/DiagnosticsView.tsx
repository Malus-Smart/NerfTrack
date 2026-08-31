import type { DiagnosticsSummary } from '../domain';
import { formatDiagnosticReason, useI18n } from '../i18n';
import { Icon } from './Icons';

export function DiagnosticsView({ diagnostics }: { diagnostics: DiagnosticsSummary }) {
  const { locale, t } = useI18n();
  const rows = [
    [t('diagnostics.eventsObserved'), diagnostics.totalEvents.toLocaleString(locale), 'activity'],
    [t('diagnostics.pricedEvents'), diagnostics.pricedEvents.toLocaleString(locale), 'check'],
    [t('diagnostics.pricingPending'), diagnostics.pendingEvents.toLocaleString(locale), 'clock'],
    [t('diagnostics.rejected'), diagnostics.rejectedEvents.toLocaleString(locale), 'alert'],
    [
      t('diagnostics.partialRetries'),
      diagnostics.partialLineRetries.toLocaleString(locale),
      'refresh',
    ],
    [t('diagnostics.monitoringGaps'), diagnostics.monitoringGaps.toLocaleString(locale), 'history'],
  ] as const;
  return (
    <section className="page-shell diagnostics-page">
      <header className="page-heading">
        <h1>{t('diagnostics.title')}</h1>
        <p>{t('diagnostics.description')}</p>
      </header>
      <div className="diagnostics-summary-grid">
        {rows.map(([label, value, icon]) => (
          <div className="diagnostic-stat" key={label}>
            <Icon name={icon} size={21} />
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="diagnostics-columns">
        <div className="panel diagnostics-list">
          <div className="panel-heading">
            <Icon name="alert" size={23} />
            <h2>{t('diagnostics.qualityReasons')}</h2>
          </div>
          {diagnostics.reasons.map((item) => (
            <div className="reason-row" key={item.reason}>
              <span>{formatDiagnosticReason(locale, item.reason)}</span>
              <strong>{item.count.toLocaleString(locale)}</strong>
            </div>
          ))}
        </div>
        <div className="panel diagnostics-list">
          <div className="panel-heading">
            <Icon name="chart" size={23} />
            <h2>{t('diagnostics.modelsObserved')}</h2>
          </div>
          {diagnostics.modelIds.map((model) => (
            <div className="model-row" key={model}>
              <span className="model-dot" />
              <code>{model}</code>
              <span className="model-status">{t('diagnostics.eligibleEvidence')}</span>
            </div>
          ))}
          <div className="privacy-note">
            <Icon name="lock" size={17} />
            {t('diagnostics.dataPrivacy')}
          </div>
        </div>
      </div>
      <div className="panel diagnostic-callout">
        <Icon name="info" size={20} />
        <div>
          <strong>{t('diagnostics.privacyTitle')}</strong>
          <span>{t('diagnostics.privacyDescription')}</span>
        </div>
      </div>
    </section>
  );
}
