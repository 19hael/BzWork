'use client';

import Link from "next/link";
import { ArrowRight, Table } from "lucide-react";
import { useSpreadsheets } from "@/lib/hooks/useSpreadsheets";

export default function SpreadsheetsPage() {
  const { spreadsheets } = useSpreadsheets();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Data hub
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">
          Operational spreadsheets
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {spreadsheets.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/dashboard/spreadsheets/${sheet.id}`}
            className="flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Table className="h-6 w-6 text-slate-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                    Sheet
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {sheet.name}
                  </h2>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-sm text-slate-500">{sheet.description}</p>
            <p className="mt-4 text-xs text-slate-400">
              Linked project: {sheet.linked_project_id}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
