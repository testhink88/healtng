import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const Field = ({ label, children }) => (
  <label className="space-y-1">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <div>{children}</div>
  </label>
);

const Chip = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm border transition ${
      active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-card border-border text-foreground hover:bg-accent'
    }`}
  >
    {children}
  </button>
);

const TYPE_OPTIONS = [
  { value: '', label: 'Selecciona…' },
  { value: 'Consultorio General', label: 'Consultorio General' },
  { value: 'Consultorio Especializado', label: 'Consultorio Especializado' },
  { value: 'Sala de Procedimientos', label: 'Sala de Procedimientos' },
  { value: 'Laboratorio', label: 'Laboratorio' },
  { value: 'Sala de Imágenes', label: 'Sala de Imágenes' },
];

const CAPACITY_OPTIONS = [
  { value: '', label: 'Selecciona…' },
  { value: '1-2', label: '1–2' },
  { value: '3-5', label: '3–5' },
  { value: '6-9', label: '6–9' },
  { value: '10+', label: '10+' },
];

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Cualquiera' },
  { value: 'inmediata', label: 'Disponible ahora' },
];

const RATING_OPTIONS = [
  { value: '', label: 'Cualquiera' },
  { value: '4+', label: '4 estrellas o más' },
  { value: '4.5+', label: '4.5 estrellas o más' },
];

const SpaceFilters = ({
  variant = 'panel', // 'panel' | 'horizontal' | 'toolbar'
  filters = {},
  onFiltersChange = () => {},
  onClearFilters = () => {},
}) => {
  const set = (key, val) => onFiltersChange({ ...filters, [key]: val });

  // ======= Layouts =======
  const isToolbar = variant === 'toolbar';
  const containerClass =
    isToolbar
      ? 'rounded-lg border border-border bg-card'
      : variant === 'horizontal'
        ? 'space-y-4'
        : 'bg-card border border-border rounded-lg p-4 space-y-4';

  // Toolbar: dos filas responsivas, estilo como en captura
  const rowClass = 'grid grid-cols-2 md:grid-cols-4 gap-3 p-4';
  const dividerClass = 'border-t border-border';

  // Controles reutilizables
  const Select = (props) => (
    <select
      {...props}
      className={
        'w-full h-9 rounded-md border border-border bg-background px-3 text-sm ' +
        (props.className || '')
      }
    />
  );

  const Input = (props) => (
    <input
      {...props}
      className={
        'w-full h-9 rounded-md border border-border bg-background px-3 text-sm ' +
        (props.className || '')
      }
    />
  );

  // ======= Render =======
  if (isToolbar) {
    return (
      <div className={containerClass}>
        {/* Fila 1 */}
        <div className={rowClass}>
          <Field label="Fecha desde">
            <Input
              type="date"
              value={filters?.startDate || ''}
              onChange={(e) => set('startDate', e.target.value)}
            />
          </Field>

          <Field label="Fecha hasta">
            <Input
              type="date"
              value={filters?.endDate || ''}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </Field>

          <Field label="Clínica">
            <Input
              placeholder="Ej: Clínica Caracas"
              value={filters?.clinic || ''}
              onChange={(e) => set('clinic', e.target.value)}
            />
          </Field>

          <Field label="Disponibilidad">
            <Select
              value={filters?.availability || ''}
              onChange={(e) => set('availability', e.target.value)}
            >
              {AVAILABILITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Fila 2 */}
        <div className={`${dividerClass} ${rowClass}`}>
          <Field label="Tipo de Espacio">
            <Select
              value={filters?.spaceType || ''}
              onChange={(e) => set('spaceType', e.target.value)}
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>

          <Field label="Capacidad">
            <Select
              value={filters?.capacity || ''}
              onChange={(e) => set('capacity', e.target.value)}
            >
              {CAPACITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>

          <Field label="Precio Min (USD)">
            <Input
              type="number"
              placeholder="Mín"
              value={filters?.minPrice || ''}
              onChange={(e) => set('minPrice', e.target.value)}
            />
          </Field>

          <Field label="Precio Max (USD)">
            <Input
              type="number"
              placeholder="Máx"
              value={filters?.maxPrice || ''}
              onChange={(e) => set('maxPrice', e.target.value)}
            />
          </Field>
        </div>

        {/* Filtro por Rating */}
        <div className={`${dividerClass} ${rowClass}`}>
          <Field label="Calificación">
            <Select
              value={filters?.rating || ''}
              onChange={(e) => set('rating', e.target.value)}
            >
              {RATING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Filtros rápidos / acciones */}
        <div className={`${dividerClass} p-3 md:p-4 flex flex-wrap gap-2 items-center`}>
          <span className="text-xs font-medium text-muted-foreground">Rápidos:</span>

          <Chip
            active={filters?.quickFilter === 'disponible-ahora'}
            onClick={() =>
              set('quickFilter', filters?.quickFilter === 'disponible-ahora' ? '' : 'disponible-ahora')
            }
          >
            <span className="inline-flex items-center gap-1">
              <Icon name="Bolt" size={14} /> Disponible Ahora
            </span>
          </Chip>

          <Chip
            active={filters?.quickFilter === 'mejor-precio'}
            onClick={() =>
              set('quickFilter', filters?.quickFilter === 'mejor-precio' ? '' : 'mejor-precio')
            }
          >
            <span className="inline-flex items-center gap-1">
              <Icon name="BadgeDollarSign" size={14} /> Mejor Precio
            </span>
          </Chip>

          <Chip
            active={filters?.quickFilter === 'mejor-calificado'}
            onClick={() =>
              set('quickFilter', filters?.quickFilter === 'mejor-calificado' ? '' : 'mejor-calificado')
            }
          >
            <span className="inline-flex items-center gap-1">
              <Icon name="Star" size={14} /> Mejor Calificado
            </span>
          </Chip>

          <Chip
            active={filters?.quickFilter === 'aprobacion-inmediata'}
            onClick={() =>
              set('quickFilter', filters?.quickFilter === 'aprobacion-inmediata' ? '' : 'aprobacion-inmediata')
            }
          >
            <span className="inline-flex items-center gap-1">
              <Icon name="ShieldCheck" size={14} /> Aprobación Inmediata
            </span>
          </Chip>

          <div className="ml-auto flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="Eraser"
              iconPosition="left"
              iconSize={14}
            >
              Limpiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ ...filters })}
              iconName="Funnel"
              iconPosition="left"
              iconSize={14}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Variantes anteriores (horizontal/panel) siguen funcionando
  const gridClass =
    variant === 'horizontal'
      ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3'
      : 'grid grid-cols-1 gap-3';

  return (
    <div className={containerClass}>
      <div className={gridClass}>
        <Field label="Clínica">
          <Input
            placeholder="Selecciona…"
            value={filters?.clinic || ''}
            onChange={(e) => set('clinic', e.target.value)}
          />
        </Field>

        <Field label="Tipo de Espacio">
          <Select
            value={filters?.spaceType || ''}
            onChange={(e) => set('spaceType', e.target.value)}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Equipamiento Requerido">
          <Input
            placeholder="Ej: Ecógrafo"
            value={filters?.equipment || ''}
            onChange={(e) => set('equipment', e.target.value)}
          />
        </Field>

        <Field label="Capacidad">
          <Select
            value={filters?.capacity || ''}
            onChange={(e) => set('capacity', e.target.value)}
          >
            {CAPACITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Precio Min (USD)">
          <Input
            type="number"
            placeholder="Mín"
            value={filters?.minPrice || ''}
            onChange={(e) => set('minPrice', e.target.value)}
          />
        </Field>

        <Field label="Precio Max (USD)">
          <Input
            type="number"
            placeholder="Máx"
            value={filters?.maxPrice || ''}
            onChange={(e) => set('maxPrice', e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <Chip
          active={filters?.quickFilter === 'disponible-ahora'}
          onClick={() =>
            set('quickFilter', filters?.quickFilter === 'disponible-ahora' ? '' : 'disponible-ahora')
          }
        >
          <span className="inline-flex items-center gap-1">
            <Icon name="Bolt" size={14} /> Disponible Ahora
          </span>
        </Chip>

        <Chip
          active={filters?.quickFilter === 'mejor-precio'}
          onClick={() =>
            set('quickFilter', filters?.quickFilter === 'mejor-precio' ? '' : 'mejor-precio')
          }
        >
          <span className="inline-flex items-center gap-1">
            <Icon name="BadgeDollarSign" size={14} /> Mejor Precio
          </span>
        </Chip>

        <Chip
          active={filters?.quickFilter === 'mejor-calificado'}
          onClick={() =>
            set('quickFilter', filters?.quickFilter === 'mejor-calificado' ? '' : 'mejor-calificado')
          }
        >
          <span className="inline-flex items-center gap-1">
            <Icon name="Star" size={14} /> Mejor Calificado
          </span>
        </Chip>

        <Chip
          active={filters?.quickFilter === 'aprobacion-inmediata'}
          onClick={() =>
            set('quickFilter', filters?.quickFilter === 'aprobacion-inmediata' ? '' : 'aprobacion-inmediata')
          }
        >
          <span className="inline-flex items-center gap-1">
            <Icon name="ShieldCheck" size={14} /> Aprobación Inmediata
          </span>
        </Chip>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="ml-auto"
          iconName="Eraser"
          iconPosition="left"
          iconSize={14}
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
};

export default SpaceFilters;
