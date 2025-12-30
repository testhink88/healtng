import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DEFAULT_FUNNEL = [
  { key: 'referral', label: 'Referidos', value: 1200, hint: 'Derivaciones y captación clínica' },
  { key: 'intake', label: 'Ingreso', value: 980, hint: 'Validación y registro inicial' },
  { key: 'assessment', label: 'Evaluación', value: 760, hint: 'Triage, diagnóstico preliminar' },
  { key: 'treatment', label: 'Tratamiento', value: 640, hint: 'Intervenciones activas' },
  { key: 'followup', label: 'Seguimiento', value: 510, hint: 'Adherencia y control longitudinal' }
];

const PatientJourneyFunnel = ({ data }) => {
  const [view, setView] = useState('volume'); // volume | conversion

  const funnel = useMemo(() => {
    const raw = (data && data.length) ? data : DEFAULT_FUNNEL;
    return raw.map((step, idx) => {
      const prev = idx === 0 ? step.value : raw[idx - 1]?.value ?? step.value;
      const conversion = prev ? Math.round((step.value / prev) * 100) : 100;
      return { ...step, conversion };
    });
  }, [data]);

  const maxVal = useMemo(() => Math.max(...funnel.map(s => s.value)), [funnel]);

  return (
    <div className="bg-card border border-border rounded-lg healthcare-shadow p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Patient Journey Funnel</h3>
          <p className="text-sm text-text-secondary">
            Visibilidad del paso a paso clínico y fugas de adherencia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={view === 'volume' ? 'default' : 'outline'}
            onClick={() => setView('volume')}
            className="text-xs"
          >
            Volumen
          </Button>
          <Button
            variant={view === 'conversion' ? 'default' : 'outline'}
            onClick={() => setView('conversion')}
            className="text-xs"
          >
            Conversión
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {funnel.map((step, idx) => {
          const width = Math.max(18, Math.round((step.value / maxVal) * 100));
          const isLast = idx === funnel.length - 1;

          return (
            <div key={step.key} className="p-4 border border-border rounded-lg clinical-transition hover:healthcare-shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon
                      name={idx === 0 ? 'Share2' : idx === 1 ? 'ClipboardList' : idx === 2 ? 'Stethoscope' : idx === 3 ? 'Activity' : 'CheckCircle'}
                      size={16}
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-text-primary">{step.label}</h4>
                      <span className="text-xs text-text-secondary">• etapa {idx + 1}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{step.hint}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-text-primary">
                    {step.value.toLocaleString()}
                  </div>
                  {!isLast && (
                    <div className="text-xs text-text-secondary">
                      Conv. a siguiente: <span className="font-medium text-text-primary">{funnel[idx + 1]?.conversion ?? 0}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Visual bar */}
              <div className="mt-3">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-primary rounded-full"
                    style={{ width: `${width}%` }}
                  />
                </div>

                {view === 'conversion' && idx > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Icon
                      name={step.conversion >= 85 ? 'TrendingUp' : step.conversion >= 70 ? 'Minus' : 'TrendingDown'}
                      size={12}
                      className={step.conversion >= 85 ? 'text-success' : step.conversion >= 70 ? 'text-warning' : 'text-error'}
                    />
                    <span className="text-xs text-text-secondary">
                      Conversión vs etapa previa:
                      <span className="ml-1 font-medium text-text-primary">{step.conversion}%</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Insight Footer */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="Lightbulb" size={16} className="text-warning" />
            <span className="text-sm text-text-secondary">
              Tip: cruza este funnel con cohortes de alto riesgo para detectar fugas tempranas.
            </span>
          </div>
          <div className="text-xs text-text-secondary">
            Vista simulada • lista para conectar con datos reales
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientJourneyFunnel;
