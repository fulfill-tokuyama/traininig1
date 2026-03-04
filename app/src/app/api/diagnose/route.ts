import { NextRequest, NextResponse } from "next/server";
import { DiagnoseRequest, DiagnosisResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: DiagnoseRequest = await request.json();
    const { tasks, industry, department } = body;

    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { error: "業務内容を入力してください" },
        { status: 400 }
      );
    }

    if (tasks.length > 50) {
      return NextResponse.json(
        { error: "50件以内で入力してください" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AIサービスの設定が完了していません。管理者にお問い合わせください。" },
        { status: 500 }
      );
    }

    const taskList = tasks
      .map((t, i) => `${i + 1}. ${t}`)
      .join("\n");

    const industryContext = industry ? `業種: ${industry}` : "";
    const deptContext = department ? `部署: ${department}` : "";

    const systemPrompt = `あなたは企業の業務DX診断の専門家です。
与えられた業務それぞれについて、以下の3つのカテゴリに分類してください。

カテゴリ:
- "AI化": 生成AI・機械学習で自動化可能な業務（データ分析、文書生成、画像認識など）
- "IT化": RPA・既存ツール・システム導入で効率化可能な業務（定型入力、ワークフロー、通知自動化など）
- "人がやるべき": 人間の判断・創造性・対人スキルが不可欠な業務（交渉、意思決定、クリエイティブ作業など）

出力はJSON配列で返してください。各要素は以下の形式です:
{
  "taskName": "入力された業務名",
  "category": "AI化" | "IT化" | "人がやるべき",
  "confidence": 0-100の整数,
  "reason": "分類理由（専門用語を避け、わかりやすく2-3文で説明）",
  "recommendation": "具体的な次のステップの提案（1-2文）"
}

重要:
- JSON配列のみを返してください。マークダウンやコードブロックは不要です。
- reasonは専門用語を使わず、経営者にもわかる平易な日本語で書いてください。
- recommendationは具体的なツール名やサービス名を含めてください。`;

    const userPrompt = `以下の業務を診断してください。
${industryContext}
${deptContext}

業務一覧:
${taskList}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "AI診断中にエラーが発生しました。しばらく経ってから再試行してください。" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AIからの応答が空でした。再試行してください。" },
        { status: 502 }
      );
    }

    let results: DiagnosisResult[];
    try {
      const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      results = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return NextResponse.json(
        { error: "診断結果の解析に失敗しました。再試行してください。" },
        { status: 502 }
      );
    }

    // Validate and sanitize results
    const validCategories = ["AI化", "IT化", "人がやるべき"];
    results = results.map((r, i) => ({
      taskName: r.taskName || tasks[i] || `業務${i + 1}`,
      category: validCategories.includes(r.category) ? r.category : "人がやるべき",
      confidence: Math.min(100, Math.max(0, Math.round(Number(r.confidence) || 50))),
      reason: r.reason || "分類理由を取得できませんでした。",
      recommendation: r.recommendation || "詳細な分析をお勧めします。",
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Diagnose API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。再試行してください。" },
      { status: 500 }
    );
  }
}
