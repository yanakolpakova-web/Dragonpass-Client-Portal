import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

// ── Shared constants ────────────────────────────────────────
export const CHART_COLORS = {
  navy: '#0a2333',
  teal: '#34d399',
  tealLight: '#a7f3d0',
  tealDark: '#065f46',
  slate: '#62748e',
  mint: '#6ee7b7',
  dark: '#152c3c',
  gray: '#cad5e2',
};

export const CHART_FONT = { fontFamily: "'Cabin', sans-serif", fontSize: 11, fill: '#62748e' };

export const TOOLTIP_STYLE = {
  contentStyle: { fontFamily: "'Cabin', sans-serif", fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' },
  cursor: { fill: '#f9fafb', stroke: 'none' },
};

export const LEGEND_STYLE = { iconType: 'circle' as const, iconSize: 8, wrapperStyle: { fontFamily: "'Cabin', sans-serif", fontSize: 12 } };

// ── Simple Bar Chart ────────────────────────────────────────
interface SimpleBarChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  bars: { dataKey: string; name: string; fill?: string; stackId?: string }[];
  height?: number;
  barSize?: number;
  barGap?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  yFormatter?: (v: number) => string;
  valueFormatter?: (v: number) => string;
}

export function SimpleBarChart({
  data, xKey, bars, height = 200, barSize = 24, barGap = 2,
  showLegend = true, showGrid = true, yFormatter, valueFormatter,
}: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barGap={barGap} barSize={barSize}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />}
        <XAxis dataKey={xKey} tick={CHART_FONT} axisLine={false} tickLine={false} />
        <YAxis tick={CHART_FONT} axisLine={false} tickLine={false} tickFormatter={yFormatter} />
        <Tooltip {...TOOLTIP_STYLE} formatter={valueFormatter ? ((v: number) => valueFormatter(v)) : undefined} />
        {showLegend && <Legend {...LEGEND_STYLE} />}
        {bars.map((bar, i) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.fill || (i === 0 ? CHART_COLORS.teal : CHART_COLORS.navy)}
            stackId={bar.stackId}
            radius={bar.stackId && i < bars.length - 1 ? [0, 0, 0, 0] : [4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Usage Combo Chart (bars + trend line) ───────────────────
interface UsageComboChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  dataKey: string;
  name?: string;
  height?: number;
  barSize?: number;
  barColor?: string;
  lineColor?: string;
  labelFormatter?: (label: string) => string;
  showLegend?: boolean;
}

export function UsageComboChart({
  data, xKey, dataKey, name = 'Usage', height = 230,
  barSize = 16, barColor = CHART_COLORS.teal, lineColor = CHART_COLORS.navy,
  labelFormatter, showLegend = true,
}: UsageComboChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey={xKey} tick={CHART_FONT} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={16} />
        <YAxis tick={CHART_FONT} axisLine={false} tickLine={false} />
        <Tooltip
          {...TOOLTIP_STYLE}
          labelFormatter={labelFormatter}
          labelStyle={{ color: '#6a7282' }}
          itemStyle={{ color: '#0a2333', fontSize: 13, fontWeight: 600 }}
          /* null name drops the "Usage :" prefix, leaving the amount alone. */
          formatter={((value: number) => [value, null]) as never}
        />
        {showLegend && (
          /* recharts colours legend text by series; override to secondary text. */
          <Legend
            {...LEGEND_STYLE}
            formatter={(value: string) => (
              <span style={{ color: '#6a7282' }}>{value}</span>
            )}
          />
        )}
        <Bar dataKey={dataKey} name={name} fill={barColor} radius={[4, 4, 0, 0]} barSize={barSize} />
        <Line type="monotone" dataKey={dataKey} name="Trend" stroke={lineColor} strokeWidth={2} dot={false} activeDot={false} legendType="plainline" tooltipType="none" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ── Simple Line Chart ───────────────────────────────────────
interface SimpleLineChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  lines: { dataKey: string; name: string; stroke?: string }[];
  height?: number;
  showLegend?: boolean;
}

export function SimpleLineChart({
  data, xKey, lines, height = 200, showLegend = true,
}: SimpleLineChartProps) {
  const defaultColors = [CHART_COLORS.gray, CHART_COLORS.navy, CHART_COLORS.teal];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey={xKey} tick={CHART_FONT} axisLine={false} tickLine={false} />
        <YAxis tick={CHART_FONT} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP_STYLE} />
        {showLegend && <Legend {...LEGEND_STYLE} />}
        {lines.map((line, i) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.stroke || defaultColors[i % defaultColors.length]}
            strokeWidth={2}
            dot={{ r: 4, fill: '#fff', stroke: line.stroke || defaultColors[i % defaultColors.length], strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Simple Area Chart ───────────────────────────────────────
interface SimpleAreaChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  dataKey: string;
  name: string;
  height?: number;
  color?: string;
  yFormatter?: (v: number) => string;
  valueFormatter?: (v: number) => string;
}

export function SimpleAreaChart({
  data, xKey, dataKey, name, height = 200,
  color = CHART_COLORS.teal, yFormatter, valueFormatter,
}: SimpleAreaChartProps) {
  const gradientId = `areaGrad-${dataKey}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey={xKey} tick={CHART_FONT} axisLine={false} tickLine={false} />
        <YAxis tick={CHART_FONT} axisLine={false} tickLine={false} tickFormatter={yFormatter} />
        <Tooltip {...TOOLTIP_STYLE} formatter={valueFormatter ? ((v: number) => valueFormatter(v)) : undefined} />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} dot={{ r: 4, fill: '#fff', stroke: color, strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Donut Chart ─────────────────────────────────────────────
interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  centerLabel?: React.ReactNode;
}

export function DonutChart({
  data, height = 200, innerRadius = 50, outerRadius = 80, showLegend = true, centerLabel,
}: DonutChartProps) {
  return (
    <div className="flex items-center gap-4" style={{ height }}>
      <div className="flex-1 h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} dataKey="value" stroke="none">
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerLabel}
          </div>
        )}
      </div>
      {showLegend && (
        <div className="flex flex-col gap-3 shrink-0 pr-2">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="font-['Cabin',sans-serif] text-[12px] text-[#0a2333]">{d.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Horizontal Progress Bars ────────────────────────────────
interface ProgressBarItem {
  name: string;
  icon?: string;
  value: number;
  color: string;
}

interface HorizontalBarsProps {
  data: ProgressBarItem[];
}

export function HorizontalBars({ data }: HorizontalBarsProps) {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          {item.icon && <span className="text-[14px] w-5 text-center shrink-0">{item.icon}</span>}
          <span className="font-['Cabin',sans-serif] text-[13px] text-[#0a2333] w-[120px] shrink-0">{item.name}</span>
          <div className="flex-1 h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
          </div>
          <span className="font-['Cabin',sans-serif] font-medium text-[13px] text-[#0a2333] w-[36px] text-right shrink-0">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}
