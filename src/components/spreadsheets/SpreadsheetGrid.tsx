"use client";

import { useEffect, useMemo, useState } from "react";
import { useSpreadsheets } from "@/lib/hooks/useSpreadsheets";
import { Spreadsheet } from "@/types";
import { FormulaBar } from "@/components/spreadsheets/FormulaBar";
import { CellEditor } from "@/components/spreadsheets/CellEditor";

type SpreadsheetGridProps = {
  sheetId: string;
};

const columnLabel = (index: number) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (index < alphabet.length) return alphabet[index];
  const first = Math.floor(index / alphabet.length) - 1;
  const second = index % alphabet.length;
  return alphabet[first] + alphabet[second];
};

const ensureMatrix = (sheet: Spreadsheet | undefined) => {
  if (!sheet?.data) return [];
  return (sheet.data as Array<Array<string | number>>).map((row) =>
    row.map((cell) => String(cell ?? ""))
  );
};

export function SpreadsheetGrid({ sheetId }: SpreadsheetGridProps) {
  const { spreadsheets, updateSpreadsheet } = useSpreadsheets();
  const sheet = useMemo(
    () => spreadsheets.find((entry) => entry.id === sheetId),
    [spreadsheets, sheetId]
  );
  const matrix = ensureMatrix(sheet);
  const [selected, setSelected] = useState({ row: 0, column: 0 });
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const value = matrix[selected.row]?.[selected.column] ?? "";
    setDraft(String(value ?? ""));
  }, [selected.row, selected.column, matrix]);

  const handleCommit = () => {
    if (!sheet) return;
    const clone = matrix.map((row) => [...row]);
    if (!clone[selected.row]) {
      clone[selected.row] = [];
    }
    clone[selected.row][selected.column] = draft;
    void updateSpreadsheet({
      ...sheet,
      data: clone,
      updated_at: new Date().toISOString(),
    });
  };

  const cellLabel = `${columnLabel(selected.column)}${selected.row + 1}`;

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-[#090f1d]/80 p-5 shadow-lg shadow-cyan-500/5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-white/70">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            Excel integrado
          </p>
          <p className="text-base font-semibold text-white">
            Celda activa: {cellLabel}
          </p>
        </div>
        <FormulaBar cellLabel={cellLabel} value={draft} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5">
        <div className="max-h-[620px] overflow-auto bg-black/20">
          <table className="min-w-full border-separate border-spacing-0 text-sm text-white/80">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 bg-white/5 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                  #
                </th>
                {matrix[0]?.map((_, columnIndex) => (
                  <th
                    key={columnIndex}
                    className="border-b border-white/10 bg-[#0e172d] px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em] text-white/40"
                  >
                    {columnLabel(columnIndex)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="sticky left-0 bg-[#0b1326] px-3 py-2 text-xs font-semibold text-white/50">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, columnIndex) => {
                    const isSelected =
                      selected.row === rowIndex && selected.column === columnIndex;
                    return (
                      <td
                        key={`${rowIndex}-${columnIndex}`}
                        onClick={() =>
                          setSelected({ row: rowIndex, column: columnIndex })
                        }
                        className={`cursor-pointer border border-white/5 px-4 py-2 ${
                          isSelected
                            ? "bg-cyan-500/20 text-white ring-2 ring-cyan-400/70"
                            : "bg-transparent text-white/80 hover:bg-white/5"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CellEditor value={draft} onChange={setDraft} onCommit={handleCommit} />
    </div>
  );
}
