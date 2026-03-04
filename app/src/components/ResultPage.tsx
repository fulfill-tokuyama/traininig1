"use client";

import { useState, useMemo, useCallback } from "react";
import { DiagnosisResult, Category } from "@/types";
import PieChart from "./PieChart";

interface ResultPageProps {
  results: DiagnosisResult[];
  department: string;
  onReset: () => void;
}

const CATEGORY_BADGE: Record<Category, { bg: string; text: string; label: string }> = {
  AI化: { bg: "bg-blue-100", text: "text-blue-800", label: "AI化できる" },
  IT化: { bg: "bg-emerald-100", text: "text-emerald-800", label: "IT化できる" },
  人がやるべき: { bg: "bg-amber-100", text: "text-amber-800", label: "人がやるべき" },
};

export default function ResultPage({ results, department, onReset }: ResultPageProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const summary = useMemo(() => {
    const counts: Record<Category, number> = { AI化: 0, IT化: 0, 人がやるべき: 0 };
    results.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return [
      { category: "AI化" as Category, count: counts["AI化"] },
      { category: "IT化" as Category, count: counts["IT化"] },
      { category: "人がやるべき" as Category, count: counts["人がやるべき"] },
    ];
  }, [results]);

  const handleCSVDownload = useCallback(() => {
    const BOM = "\uFEFF";
    const header = "業務名,分類,確信度(%),診断理由,推奨アクション";
    const rows = results.map((r) =>
      [
        `"${r.taskName.replace(/"/g, '""')}"`,
        r.category,
        r.confidence,
        `"${r.reason.replace(/"/g, '""')}"`,
        `"${r.recommendation.replace(/"/g, '""')}"`,
      ].join(",")
    );
    const csv = BOM + header + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `業務診断結果_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">診断結果</h1>
        {department && (
          <p className="mt-1 text-gray-600">
            部署: <span className="font-medium">{department}</span>
          </p>
        )}
      </div>

      {/* Summary chart */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">サマリー</h2>
        <PieChart data={summary} />
      </section>

      {/* Confidence explanation */}
      <p className="mb-4 text-xs text-gray-500">
        ※ 確信度はAIがその分類にどれくらい自信を持っているかを0〜100%で表しています。高いほど分類の確度が高いことを意味します。
      </p>

      {/* Results table - Desktop */}
      <section className="mb-8 hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-700">業務名</th>
                <th className="px-4 py-3 font-semibold text-gray-700">分類</th>
                <th className="px-4 py-3 font-semibold text-gray-700" title="AIがこの分類にどれくらい自信を持っているかを示します">
                  確信度
                  <span className="ml-1 inline-block cursor-help text-xs text-gray-400">(?)</span>
                </th>
                <th className="px-4 py-3 font-semibold text-gray-700">診断理由</th>
                <th className="px-4 py-3 font-semibold text-gray-700">推奨アクション</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const badge = CATEGORY_BADGE[r.category];
                return (
                  <tr
                    key={i}
                    className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                    onClick={() => toggleExpand(i)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-1">
                        <span
                          className={`transform transition-transform ${expandedIndex === i ? "rotate-90" : ""}`}
                        >
                          ▶
                        </span>
                        {r.taskName}
                      </div>
                      {expandedIndex === i && (
                        <div className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                          <p className="font-medium text-gray-700">詳細理由:</p>
                          <p className="mt-1">{r.reason}</p>
                          <p className="mt-2 font-medium text-gray-700">推奨アクション:</p>
                          <p className="mt-1">{r.recommendation}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badge.bg} ${badge.text}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.confidence}%</td>
                    <td className="max-w-xs px-4 py-3 text-gray-600 truncate">
                      {r.reason}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-gray-600 truncate">
                      {r.recommendation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="px-4 py-2 text-xs text-gray-400">
          ※ 行をクリックすると詳細を展開できます
        </p>
      </section>

      {/* Results cards - Mobile */}
      <section className="mb-8 space-y-3 md:hidden">
        {results.map((r, i) => {
          const badge = CATEGORY_BADGE[r.category];
          return (
            <div
              key={i}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              onClick={() => toggleExpand(i)}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-900">{r.taskName}</h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.bg} ${badge.text}`}
                >
                  {badge.label}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span title="AIがこの分類にどれくらい自信を持っているかを示します">確信度: {r.confidence}%</span>
                <span
                  className={`transform transition-transform ${expandedIndex === i ? "rotate-90" : ""}`}
                >
                  ▶
                </span>
              </div>
              {expandedIndex === i && (
                <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700">診断理由</p>
                    <p className="mt-0.5">{r.reason}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">推奨アクション</p>
                    <p className="mt-0.5">{r.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <p className="text-center text-xs text-gray-400">
          ※ カードをタップすると詳細を展開できます
        </p>
      </section>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={handleCSVDownload}
          className="rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
        >
          CSV出力
        </button>
        <button
          onClick={onReset}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
