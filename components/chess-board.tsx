"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getPossibleMoves, movePiece } from "@/lib/chess-utils"

interface ChessBoardProps {
  boardState?: any
  playerColor?: "white" | "black"
  currentTurn?: "white" | "black"
  onMove?: (from: string, to: string, newBoardState: any) => void
  readOnly?: boolean
}

const initialBoardState = [
  [
    { type: "rook", color: "black" },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black" },
  ],
  [
    { type: "pawn", color: "black" },
    { type: "pawn", color: "black" },
    { type: "pawn", color: "black" },
    { type: "pawn", color: "black" },
    { type: "pawn", color: "black" },
    { type: "pawn", color: "black" },
    { type: "pawn", color: "black" },
    { type: "pawn", color: "black" },
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: "pawn", color: "white" },
    { type: "pawn", color: "white" },
    { type: "pawn", color: "white" },
    { type: "pawn", color: "white" },
    { type: "pawn", color: "white" },
    { type: "pawn", color: "white" },
    { type: "pawn", color: "white" },
    { type: "pawn", color: "white" },
  ],
  [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ],
]

export function ChessBoard({
  boardState,
  playerColor = "white",
  currentTurn = "white",
  onMove,
  readOnly = false,
}: ChessBoardProps) {
  const [board, setBoard] = useState<any>(boardState || initialBoardState)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<string[]>([])
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)

  useEffect(() => {
    if (boardState) {
      setBoard(boardState)
    }
  }, [boardState])

  const handleSquareClick = (square: string) => {
    if (readOnly) return

    // If it's not the player's turn, don't allow moves
    if (currentTurn !== playerColor) return

    const [file, rank] = square.split("")
    const fileIndex = "abcdefgh".indexOf(file)
    const rankIndex = 8 - Number.parseInt(rank)
    const piece = board[rankIndex][fileIndex]

    // If a square is already selected
    if (selectedSquare) {
      // If clicking on the same square, deselect it
      if (selectedSquare === square) {
        setSelectedSquare(null)
        setPossibleMoves([])
        return
      }

      // If clicking on a possible move square, make the move
      if (possibleMoves.includes(square)) {
        const newBoardState = movePiece(board, selectedSquare, square)
        setBoard(newBoardState)
        setLastMove({ from: selectedSquare, to: square })
        setSelectedSquare(null)
        setPossibleMoves([])

        // Notify parent component about the move
        if (onMove) {
          onMove(selectedSquare, square, newBoardState)
        }
        return
      }

      // If clicking on another piece of the same color, select that piece instead
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square)
        setPossibleMoves(getPossibleMoves(board, square))
        return
      }

      // If clicking on an empty square or opponent's piece that's not a valid move
      setSelectedSquare(null)
      setPossibleMoves([])
      return
    }

    // If no square is selected and clicked on a piece of the player's color
    if (piece && piece.color === playerColor) {
      setSelectedSquare(square)
      setPossibleMoves(getPossibleMoves(board, square))
    }
  }

  // Determine if the board should be flipped based on player color
  const isFlipped = playerColor === "black"

  // Create the board squares
  const renderBoard = () => {
    const squares = []
    const files = "abcdefgh"

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        // Adjust indices if board is flipped
        const displayRank = isFlipped ? rank : 7 - rank
        const displayFile = isFlipped ? 7 - file : file

        const squareName = `${files[displayFile]}${8 - displayRank}`
        const isLightSquare = (displayRank + displayFile) % 2 === 0
        const piece = board[displayRank][displayFile]

        const isSelected = selectedSquare === squareName
        const isPossibleMove = possibleMoves.includes(squareName)
        const isLastMoveFrom = lastMove && lastMove.from === squareName
        const isLastMoveTo = lastMove && lastMove.to === squareName

        squares.push(
          <div
            key={squareName}
            className={cn(
              "relative w-full aspect-square flex items-center justify-center",
              isLightSquare ? "bg-[#f0d9b5]" : "bg-[#b58863]",
              isSelected && "ring-2 ring-inset ring-blue-500",
              isLastMoveFrom && "bg-yellow-200/40",
              isLastMoveTo && "bg-yellow-400/40",
              !readOnly && "cursor-pointer hover:opacity-90",
            )}
            onClick={() => handleSquareClick(squareName)}
            data-square={squareName}
          >
            {/* Rank and file labels */}
            {displayFile === 0 && (
              <span className="absolute left-1 top-0 text-xs font-semibold text-gray-700">{8 - displayRank}</span>
            )}
            {displayRank === 7 && (
              <span className="absolute right-1 bottom-0 text-xs font-semibold text-gray-700">
                {files[displayFile]}
              </span>
            )}

            {/* Piece */}
            {piece && (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center",
                  piece.color === playerColor &&
                    !readOnly &&
                    currentTurn === playerColor &&
                    "hover:scale-110 transition-transform",
                )}
              >
                <PieceIcon piece={piece} />
              </div>
            )}

            {/* Possible move indicator */}
            {isPossibleMove && (
              <div
                className={cn(
                  "absolute w-1/3 h-1/3 rounded-full bg-blue-500/50",
                  piece && "w-full h-full rounded-none ring-2 ring-blue-500/50 bg-transparent",
                )}
              />
            )}
          </div>,
        )
      }
    }

    return squares
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-8 border border-gray-800 shadow-lg">{renderBoard()}</div>

      {/* Player indicator */}
      <div className="mt-2 text-center text-sm">
        You are playing as
        <span className={`font-bold ${playerColor === "white" ? "text-gray-700" : "text-gray-900"}`}>
          {" " + playerColor}
        </span>
      </div>
    </div>
  )
}

function PieceIcon({ piece }: { piece: { type: string; color: string } }) {
  const pieceMap: Record<string, string> = {
    "white-pawn": "♙",
    "white-rook": "♖",
    "white-knight": "♘",
    "white-bishop": "♗",
    "white-queen": "♕",
    "white-king": "♔",
    "black-pawn": "♟",
    "black-rook": "♜",
    "black-knight": "♞",
    "black-bishop": "♝",
    "black-queen": "♛",
    "black-king": "♚",
  }

  const pieceKey = `${piece.color}-${piece.type}`

  return <span className="text-4xl select-none">{pieceMap[pieceKey]}</span>
}
