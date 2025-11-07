import { NextResponse } from "next/server";
import { mockAutomations } from "@/lib/data/mock";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const automation =
    mockAutomations.find((entry) => entry.id === params.id) ??
    mockAutomations[0];
  const executionId = `exec-${Math.random().toString(36).slice(2, 8)}`;
  return NextResponse.json({
    success: true,
    executionId,
    automationId: automation.id,
    message: `Executed ${automation.name}`,
    completedAt: new Date().toISOString(),
  });
}
