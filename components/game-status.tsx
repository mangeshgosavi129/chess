"use client"

interface GameStatusProps {
  gameStatus: "waiting" | "active" | "checkmate" | "stalemate" | "resigned"
  currentTurn: "white" | "black"
  playerColor: "white" | "black"
}

export function GameStatus({ gameStatus, currentTurn, playerColor }: GameStatusProps) {
  const isPlayerTurn = currentTurn === playerColor

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Game Status</h2>

      {gameStatus === "waiting" && <div className="text-amber-600">Waiting for opponent to join...</div>}

      {gameStatus === "active" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${currentTurn === "white" ? "bg-white border border-gray-300" : "bg-gray-800"}`}
            ></div>
            <span className="font-medium">{currentTurn === "white" ? "White" : "Black"}'s turn</span>
          </div>

          {isPlayerTurn ? (
            <div className="text-green-600 font-medium">Your turn</div>
          ) : (
            <div className="text-gray-500">Waiting for opponent...</div>
          )}
        </div>
      )}

      {gameStatus === "checkmate" && (
        <div className="text-red-600 font-medium">Checkmate! {currentTurn === "white" ? "Black" : "White"} wins!</div>
      )}

      {gameStatus === "stalemate" && <div className="text-amber-600 font-medium">Stalemate! The game is a draw.</div>}

      {gameStatus === "resigned" && <div className="text-red-600 font-medium">Game over. A player has resigned.</div>}
    </div>
  )
}
