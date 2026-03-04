"use client";

import { useState, useCallback, useEffect } from "react";
import { DiagnosisResult, DiagnoseResponse } from "@/types";
import InputForm from "@/components/InputForm";
import LoadingOverlay from "@/components/LoadingOverlay";
import ResultPage from "@/components/ResultPage";

type AppState = "input" | "loading" | "result";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("input");
  const [results, setResults] = useState<DiagnosisResult[]>([]);
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 0, taskName: "" });
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Browser back handling
  useEffect(() => {
    const handlePopState = () => {
      if (abortController) {
        abortController.abort();
        setAbortController(null);
      }
      setAppState("input");
      setError("");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [abortController]);

  const handleSubmit = useCallback(
    async (tasks: string[], industry: string, dept: string) => {
      setDepartment(dept);
      setError("");
      setProgress({ current: 0, total: tasks.length, taskName: tasks[0] });
      setAppState("loading");
      window.history.pushState({ state: "loading" }, "");

      const controller = new AbortController();
      setAbortController(controller);

      // Simulate progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev.current >= prev.total - 1) {
            clearInterval(progressInterval);
            return prev;
          }
          const next = prev.current + 1;
          return {
            ...prev,
            current: next,
            taskName: tasks[Math.min(next, tasks.length - 1)],
          };
        });
      }, 800);

      try {
        const response = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks, industry: industry || undefined, department: dept || undefined }),
          signal: controller.signal,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "診断に失敗しました");
        }

        const data: DiagnoseResponse = await response.json();
        setResults(data.results);
        setProgress({ current: tasks.length, total: tasks.length, taskName: "" });
        setAbortController(null);
        setAppState("result");
        window.history.pushState({ state: "result" }, "");
      } catch (err) {
        clearInterval(progressInterval);
        setAbortController(null);
        if (err instanceof DOMException && err.name === "AbortError") {
          return; // User navigated back, do nothing
        }
        setError(
          err instanceof Error
            ? err.message
            : "ネットワークエラーが発生しました。接続を確認して再試行してください。"
        );
        setAppState("input");
      }
    },
    []
  );

  const handleRetry = useCallback(() => {
    setResults([]);
    setError("");
    setAppState("input");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {appState === "input" && (
        <InputForm onSubmit={handleSubmit} error={error} />
      )}

      {appState === "loading" && (
        <LoadingOverlay
          current={progress.current}
          total={progress.total}
          taskName={progress.taskName}
        />
      )}

      {appState === "result" && (
        <ResultPage
          results={results}
          department={department}
          onReset={handleRetry}
        />
      )}
    </div>
  );
}
