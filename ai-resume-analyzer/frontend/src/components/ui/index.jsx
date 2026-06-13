import { motion } from 'framer-motion';
import clsx from 'clsx';

// ── Score Ring ─────────────────────────────────────────────────────────────
export function ScoreRing({ score, size = 120, strokeWidth = 10, label, color }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const hue = color || (score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-200 dark:text-slate-700" />
          <motion.circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={hue} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">{score}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>}
    </div>
  );
}

// ── Progress Bar ────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 100, color, className, showLabel = true, size = 'md' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = color || (pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500');
  const h = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx('w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden', h)}>
        <motion.div
          className={clsx('h-full rounded-full', barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-slate-500">{pct}%</span>
        </div>
      )}
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'primary', subtitle, trend }) {
  const colorMap = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };
  return (
    <motion.div className="card p-5 flex items-start gap-4"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[color])}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

// ── Section Header ──────────────────────────────────────────────────────────
export function SectionHeader({ title, description, icon: Icon, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon size={20} />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ── Loading Skeleton ────────────────────────────────────────────────────────
export function Skeleton({ className }) {
  return (
    <div className={clsx('bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse', className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="card p-12 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Icon size={32} className="text-slate-400" />
        </div>
      )}
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Chip / Tag ──────────────────────────────────────────────────────────────
export function Chip({ label, variant = 'default', icon: Icon, onRemove }) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    green: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  };
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', variants[variant])}>
      {Icon && <Icon size={11} />}
      {label}
    </span>
  );
}

// ── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', message }) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
  };
  return (
    <div className={clsx('border rounded-xl px-4 py-3 text-sm', styles[type])}>
      {message}
    </div>
  );
}
