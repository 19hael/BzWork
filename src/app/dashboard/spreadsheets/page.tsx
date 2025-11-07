'use client';

import Link from "next/link";
import { ArrowRight, Table } from "lucide-react";
import { useSpreadsheets } from "@/lib/hooks/useSpreadsheets";

export default function SpreadsheetsPage() {
  const { spreadsheets } = useSpreadsheets();

  return (
    <div className="space-y-6 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
          Data hub
        </p>
        <h1 className="text-2xl font-semibold">Operational spreadsheets</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {spreadsheets.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/dashboard/spreadsheets/${sheet.id}`}
            className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm shadow-cyan-500/5 transition hover:-translate-y-1 hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Table className="h-6 w-6 text-cyan-300" />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40">
                    Sheet
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    {sheet.name}
                  </h2>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-white/50" />
            </div>
            <p className="mt-2 text-sm text-white/70">{sheet.description}</p>
            <p className="mt-4 text-xs text-white/50">
              Linked project: {sheet.linked_project_id}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
