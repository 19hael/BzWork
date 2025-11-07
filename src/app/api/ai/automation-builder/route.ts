import { NextResponse } from "next/server";
import { simulateAutomationBuilder } from "@/lib/ai/simulators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const description = body?.description ?? "";
    const result = await simulateAutomationBuilder(description);
    return NextResponse.json({ success: true, automation: result });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
