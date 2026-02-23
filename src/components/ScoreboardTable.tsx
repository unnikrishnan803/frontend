interface ScoreboardRow {
  id: string;
  name: string;
  score: number;
}

interface ScoreboardTableProps {
  rows: ScoreboardRow[];
}

export function ScoreboardTable({ rows }: ScoreboardTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-blush/20">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-blush">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 text-right font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className="border-t border-blush/10">
              <td className="px-4 py-3 text-white/70">{index + 1}</td>
              <td className="px-4 py-3 text-white">{row.name}</td>
              <td className="px-4 py-3 text-right font-semibold text-mint">{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
