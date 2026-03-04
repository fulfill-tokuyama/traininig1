"use client";

import { Category } from "@/types";

interface PieChartProps {
  data: { category: Category; count: number }[];
}

const CATEGORY_COLORS: Record<Category, string> = {
  AI化: "#3B82F6",
  IT化: "#10B981",
  人がやるべき: "#F59E0B",
};

const CATEGORY_LABELS: Record<Category, string> = {
  AI化: "AI化できる",
  IT化: "IT化できる",
  人がやるべき: "人がやるべき",
};

export default function PieChart({ data }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return null;

  // Build SVG pie slices
  let cumulativeAngle = 0;
  const slices = data
    .filter((d) => d.count > 0)
    .map((d) => {
      const angle = (d.count / total) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;

      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((startAngle + angle - 90) * Math.PI) / 180;

      const r = 80;
      const cx = 100;
      const cy = 100;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      // Full circle special case
      if (angle >= 359.99) {
        return {
          path: `M ${cx},${cy - r} A ${r},${r} 0 1,1 ${cx - 0.01},${cy - r} Z`,
          color: CATEGORY_COLORS[d.category],
          category: d.category,
        };
      }

      return {
        path: `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`,
        color: CATEGORY_COLORS[d.category],
        category: d.category,
      };
    });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
      {/* SVG Chart */}
      <svg viewBox="0 0 200 200" className="h-48 w-48 shrink-0">
        {slices.map((slice, i) => (
          <path key={i} d={slice.path} fill={slice.color} />
        ))}
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-3">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
          return (
            <div key={d.category} className="flex items-center gap-3">
              <span
                className="inline-block h-4 w-4 rounded-sm"
                style={{ backgroundColor: CATEGORY_COLORS[d.category] }}
              />
              <span className="text-sm font-medium text-gray-700">
                {CATEGORY_LABELS[d.category]}: {d.count}件 ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
