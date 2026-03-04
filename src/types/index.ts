export type Category = "AI化" | "IT化" | "人がやるべき";

export interface DiagnosisResult {
  taskName: string;
  category: Category;
  confidence: number;
  reason: string;
  recommendation: string;
}

export interface DiagnoseRequest {
  tasks: string[];
  industry?: string;
  department?: string;
}

export interface DiagnoseResponse {
  results: DiagnosisResult[];
}
