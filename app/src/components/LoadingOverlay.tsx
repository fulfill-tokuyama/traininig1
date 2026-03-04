"use client";

interface LoadingOverlayProps {
  current: number;
  total: number;
  taskName: string;
}

export default function LoadingOverlay({
  current,
  total,
  taskName,
}: LoadingOverlayProps) {
  const percentage = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-full max-w-md px-6 text-center">
        {/* Spinner */}
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

        <h2 className="mb-3 text-xl font-bold text-gray-800">分析中...</h2>

        {taskName && (
          <p className="mb-2 text-gray-600">
            「{taskName.length > 30 ? taskName.slice(0, 30) + "..." : taskName}」を分析しています
          </p>
        )}

        <p className="mb-4 text-sm text-gray-500">
          ({total}件中 {Math.min(current + 1, total)}件目を処理中)
        </p>

        {/* Progress bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-blue-600">
          {Math.min(percentage, 100)}%
        </p>
      </div>
    </div>
  );
}
