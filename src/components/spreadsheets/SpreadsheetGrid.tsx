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
    updateSpreadsheet({
      ...sheet,
      data: clone,
      updated_at: new Date().toISOString(),
    });
  };

  const cellLabel = `${columnLabel(selected.column)}${selected.row + 1}`;

  return (
    <div className="space-y-4">
      <FormulaBar cellLabel={cellLabel} value={draft} />
      <div className="overflow-auto rounded-3xl border border-slate-200 bg-white">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 bg-slate-100 px-3 py-2 text-left text-xs font-semibold text-slate-500">
                #
              </th>
              {matrix[0]?.map((_, columnIndex) => (
                <th
                  key={columnIndex}
                  className="border-b border-slate-100 px-4 py-2 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
                >
                  {columnLabel(columnIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="sticky left-0 bg-white px-3 py-2 text-xs font-semibold text-slate-400">
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
                      className={`cursor-pointer border border-slate-100 px-4 py-2 text-slate-700 ${
                        isSelected
                          ? "bg-amber-50 ring-2 ring-amber-400"
                          : "bg-white hover:bg-slate-50"
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
      <CellEditor
        value={draft}
        onChange={setDraft}
        onCommit={handleCommit}
      />
    </div>
  );
}
