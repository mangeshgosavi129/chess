interface MoveHistoryProps {
  moves: string[]
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Move History</h2>

      {moves.length === 0 ? (
        <div className="text-gray-500 text-sm">No moves yet</div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1 w-10">#</th>
                <th className="text-left py-1">White</th>
                <th className="text-left py-1">Black</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-1 text-gray-500">{i + 1}.</td>
                  <td className="py-1">{moves[i * 2] || ""}</td>
                  <td className="py-1">{moves[i * 2 + 1] || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
