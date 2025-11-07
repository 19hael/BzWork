import { NextResponse } from "next/server";
import { simulateAIChatResponse } from "@/lib/ai/simulators";
import { mockWorkspace } from "@/lib/data/mock";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message ?? "";
    const response = await simulateAIChatResponse(message, {
      workspaceId: mockWorkspace.id,
      userId: mockWorkspace.owner_id,
    });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
