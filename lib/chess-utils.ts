// Initial board state
export const initialBoardState = [
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

// Convert algebraic notation (e.g., "e4") to board indices
export function squareToIndices(square: string): [number, number] {
  const file = square.charAt(0).toLowerCase()
  const rank = Number.parseInt(square.charAt(1))

  const fileIndex = "abcdefgh".indexOf(file)
  const rankIndex = 8 - rank

  return [rankIndex, fileIndex]
}

// Convert board indices to algebraic notation
export function indicesToSquare(rankIndex: number, fileIndex: number): string {
  const file = "abcdefgh".charAt(fileIndex)
  const rank = 8 - rankIndex

  return `${file}${rank}`
}

// Get the piece at a specific square
export function getPieceAtSquare(board: any[][], square: string) {
  const [rankIndex, fileIndex] = squareToIndices(square)
  return board[rankIndex][fileIndex]
}

// Check if a move is valid (simplified for this example)
export function isValidMove(board: any[][], fromSquare: string, toSquare: string): boolean {
  const [fromRank, fromFile] = squareToIndices(fromSquare)
  const [toRank, toFile] = squareToIndices(toSquare)

  const piece = board[fromRank][fromFile]
  if (!piece) return false

  const targetPiece = board[toRank][toFile]

  // Can't capture your own pieces
  if (targetPiece && targetPiece.color === piece.color) {
    return false
  }

  // This is a simplified implementation
  // In a real chess game, you'd need to check specific piece movement rules
  // and other rules like check, castling, en passant, etc.

  // For this example, we'll just implement basic movement patterns
  switch (piece.type) {
    case "pawn": {
      // Pawns move differently based on color
      const direction = piece.color === "white" ? -1 : 1

      // Forward movement (no capture)
      if (fromFile === toFile && !targetPiece) {
        // Single square forward
        if (toRank === fromRank + direction) {
          return true
        }

        // Double square forward from starting position
        if (
          (piece.color === "white" && fromRank === 6 && toRank === 4) ||
          (piece.color === "black" && fromRank === 1 && toRank === 3)
        ) {
          // Check if the path is clear
          if (!board[fromRank + direction][fromFile]) {
            return true
          }
        }
      }

      // Diagonal capture
      if (Math.abs(fromFile - toFile) === 1 && toRank === fromRank + direction) {
        // Must have an opponent's piece to capture
        return !!targetPiece && targetPiece.color !== piece.color
      }

      return false
    }

    case "rook": {
      // Rooks move horizontally or vertically
      if (fromRank !== toRank && fromFile !== toFile) {
        return false
      }

      // Check if the path is clear
      if (fromRank === toRank) {
        // Horizontal movement
        const start = Math.min(fromFile, toFile)
        const end = Math.max(fromFile, toFile)

        for (let file = start + 1; file < end; file++) {
          if (board[fromRank][file]) {
            return false // Path is blocked
          }
        }
      } else {
        // Vertical movement
        const start = Math.min(fromRank, toRank)
        const end = Math.max(fromRank, toRank)

        for (let rank = start + 1; rank < end; rank++) {
          if (board[rank][fromFile]) {
            return false // Path is blocked
          }
        }
      }

      return true
    }

    case "knight": {
      // Knights move in an L-shape
      const rankDiff = Math.abs(fromRank - toRank)
      const fileDiff = Math.abs(fromFile - toFile)

      return (rankDiff === 1 && fileDiff === 2) || (rankDiff === 2 && fileDiff === 1)
    }

    case "bishop": {
      // Bishops move diagonally
      const rankDiff = Math.abs(fromRank - toRank)
      const fileDiff = Math.abs(fromFile - toFile)

      if (rankDiff !== fileDiff) {
        return false
      }

      // Check if the path is clear
      const rankDir = toRank > fromRank ? 1 : -1
      const fileDir = toFile > fromFile ? 1 : -1

      for (let i = 1; i < rankDiff; i++) {
        if (board[fromRank + i * rankDir][fromFile + i * fileDir]) {
          return false // Path is blocked
        }
      }

      return true
    }

    case "queen": {
      // Queens move like rooks or bishops
      const rankDiff = Math.abs(fromRank - toRank)
      const fileDiff = Math.abs(fromFile - toFile)

      // Moving like a rook (horizontally or vertically)
      if (fromRank === toRank || fromFile === toFile) {
        if (fromRank === toRank) {
          // Horizontal movement
          const start = Math.min(fromFile, toFile)
          const end = Math.max(fromFile, toFile)

          for (let file = start + 1; file < end; file++) {
            if (board[fromRank][file]) {
              return false // Path is blocked
            }
          }
        } else {
          // Vertical movement
          const start = Math.min(fromRank, toRank)
          const end = Math.max(fromRank, toRank)

          for (let rank = start + 1; rank < end; rank++) {
            if (board[rank][fromFile]) {
              return false // Path is blocked
            }
          }
        }

        return true
      }

      // Moving like a bishop (diagonally)
      if (rankDiff === fileDiff) {
        const rankDir = toRank > fromRank ? 1 : -1
        const fileDir = toFile > fromFile ? 1 : -1

        for (let i = 1; i < rankDiff; i++) {
          if (board[fromRank + i * rankDir][fromFile + i * fileDir]) {
            return false // Path is blocked
          }
        }

        return true
      }

      return false
    }

    case "king": {
      // Kings move one square in any direction
      const rankDiff = Math.abs(fromRank - toRank)
      const fileDiff = Math.abs(fromFile - toFile)

      return rankDiff <= 1 && fileDiff <= 1
    }

    default:
      return false
  }
}

// Get all possible moves for a piece
export function getPossibleMoves(board: any[][], square: string): string[] {
  const [rankIndex, fileIndex] = squareToIndices(square)
  const piece = board[rankIndex][fileIndex]

  if (!piece) return []

  const possibleMoves: string[] = []

  // Check all squares on the board
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const targetSquare = indicesToSquare(r, f)

      // Skip the current square
      if (targetSquare === square) continue

      // Check if the move is valid
      if (isValidMove(board, square, targetSquare)) {
        possibleMoves.push(targetSquare)
      }
    }
  }

  return possibleMoves
}

// Move a piece on the board
export function movePiece(board: any[][], fromSquare: string, toSquare: string): any[][] {
  const [fromRank, fromFile] = squareToIndices(fromSquare)
  const [toRank, toFile] = squareToIndices(toSquare)

  // Create a deep copy of the board
  const newBoard = JSON.parse(JSON.stringify(board))

  // Move the piece
  newBoard[toRank][toFile] = newBoard[fromRank][fromFile]
  newBoard[fromRank][fromFile] = null

  return newBoard
}

// Check if a king is in check
export function isCheck(board: any[][], color: string): boolean {
  // Find the king
  let kingSquare = ""

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f]
      if (piece && piece.type === "king" && piece.color === color) {
        kingSquare = indicesToSquare(r, f)
        break
      }
    }
    if (kingSquare) break
  }

  // Check if any opponent piece can capture the king
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f]
      if (piece && piece.color !== color) {
        const fromSquare = indicesToSquare(r, f)
        if (isValidMove(board, fromSquare, kingSquare)) {
          return true
        }
      }
    }
  }

  return false
}
