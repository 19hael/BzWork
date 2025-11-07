import { NextResponse } from "next/server";
import { simulateFormulaAssist } from "@/lib/ai/simulators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body?.query ?? "";
    const result = await simulateFormulaAssist(query);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
