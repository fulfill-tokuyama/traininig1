"use client";

import { useState, useMemo } from "react";

const INDUSTRIES = [
  "製造業",
  "サービス業",
  "IT・通信",
  "小売・流通",
  "金融・保険",
  "医療・福祉",
  "建設・不動産",
  "その他",
];

const PLACEHOLDER = `例:\n請求書の作成と送付\n顧客からの問い合わせ対応\n月次売上レポートの作成\n社員の勤怠管理\n新商品の企画立案`;

interface InputFormProps {
  onSubmit: (tasks: string[], industry: string, department: string) => void;
  error: string;
}

export default function InputForm({ onSubmit, error }: InputFormProps) {
  const [taskText, setTaskText] = useState("");
  const [industry, setIndustry] = useState("");
  const [department, setDepartment] = useState("");

  const parsedTasks = useMemo(() => {
    return taskText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }, [taskText]);

  const taskCount = parsedTasks.length;
  const isOverLimit = taskCount > 50;
  const hasLongTask = parsedTasks.some((t) => t.length > 500);
  const isValid = taskCount > 0 && !isOverLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const truncated = parsedTasks.map((t) => (t.length > 500 ? t.slice(0, 500) : t));
    onSubmit(truncated, industry, department);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            AI業務棚卸しツール
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            あなたの業務、AIで変えられるかも？
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">エラーが発生しました</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8"
        >
          {/* Industry */}
          <div className="mb-5">
            <label
              htmlFor="industry"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              業種
              <span className="ml-2 text-xs text-gray-400">（任意）</span>
            </label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="">選択してください</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="mb-5">
            <label
              htmlFor="department"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              部署名
              <span className="ml-2 text-xs text-gray-400">（任意）</span>
            </label>
            <input
              id="department"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="例: 営業部"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Task textarea */}
          <div className="mb-6">
            <label
              htmlFor="tasks"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              業務内容
              <span className="ml-2 text-xs text-red-500">（必須・1行に1つ）</span>
            </label>
            <textarea
              id="tasks"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={8}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
            <div className="mt-1.5 flex justify-between text-xs">
              <span className={isOverLimit ? "text-red-500 font-medium" : "text-gray-400"}>
                {taskCount > 0 && `${taskCount}件入力中`}
                {isOverLimit && "（50件以内で入力してください）"}
              </span>
              {hasLongTask && (
                <span className="text-amber-500">
                  500文字を超える業務名は切り詰められます
                </span>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            診断する（無料）
          </button>

          <p className="mt-4 text-center text-xs text-gray-400">
            ※ 入力内容はサーバーに保存されません
          </p>
        </form>
      </div>
    </div>
  );
}
