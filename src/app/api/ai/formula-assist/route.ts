import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJsonResponse, logAIInteraction } from "@/lib/ai/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body?.query ?? "";
    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompt = `Eres el copiloto de hojas de cálculo de BzWork. Genera una fórmula, explicación breve y ejemplo práctico respondiendo solo en JSON con la forma {"formula":"","explanation":"","example":""}. Entrada del usuario: "${query}"`;

    const response = await generateJsonResponse(prompt);
    const payload = {
      formula: response.formula ?? "=SUM(A2:A10)",
      explanation:
        response.explanation ?? "Suma el rango indicado para obtener el total.",
      example:
        response.example ??
        "Ejemplo: =SUM(Pipeline!B2:B10) retorna el ARR consolidado.",
    };

    await logAIInteraction(supabase, {
      userId: user.id,
      interactionType: "formula_assist",
      input: { query },
      output: payload,
    });

    return NextResponse.json({ success: true, result: payload });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
