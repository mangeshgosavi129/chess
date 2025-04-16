"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChessBoard } from "@/components/chess-board"
import { GameStatus } from "@/components/game-status"
import { MoveHistory } from "@/components/move-history"
import { initialBoardState } from "@/lib/chess-utils"
import { getGame, updateGame } from "@/lib/game-service"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameCode = params.code as string

  const [gameData, setGameData] = useState<any>(null)
  const [boardState, setBoardState] = useState(initialBoardState)
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white")
  const [opponentColor, setOpponentColor] = useState<"white" | "black">("black")
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState<"waiting" | "active" | "checkmate" | "stalemate" | "resigned">("waiting")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastFetchTime, setLastFetchTime] = useState(0)

  // Determine if the player is joining as the creator or the opponent
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    async function loadGame() {
      try {
        // Load game data
        const data = await getGame(gameCode)

        if (!data) {
          setError("Game not found")
          setLoading(false)
          return
        }

        setGameData(data)

        // Check if there's stored player preference for this game
        const storedPlayerInfo = localStorage.getItem(`player_${gameCode}`)

        if (storedPlayerInfo) {
          // Player has visited this game before, use their stored color
          const { playerColor: storedColor, isCreator: storedIsCreator } = JSON.parse(storedPlayerInfo)
          setPlayerColor(storedColor)
          setOpponentColor(storedColor === "white" ? "black" : "white")
          setIsCreator(storedIsCreator)
        } else {
          // First time visiting, determine if they're the creator or opponent
          const localStorageGame = localStorage.getItem(`game_${gameCode}`)
          const isGameCreator = !!localStorageGame

          if (isGameCreator) {
            // This player created the game
            setPlayerColor(data.playerColor)
            setOpponentColor(data.playerColor === "white" ? "black" : "white")
            setIsCreator(true)

            // Store this preference
            localStorage.setItem(
              `player_${gameCode}`,
              JSON.stringify({
                playerColor: data.playerColor,
                isCreator: true,
              }),
            )
          } else {
            // This player is joining as the opponent
            setPlayerColor(data.playerColor === "white" ? "black" : "white")
            setOpponentColor(data.playerColor)
            setIsCreator(false)

            // Store this preference
            localStorage.setItem(
              `player_${gameCode}`,
              JSON.stringify({
                playerColor: data.playerColor === "white" ? "black" : "white",
                isCreator: false,
              }),
            )
          }
        }

        // Set game state
        if (data.board !== "initial") {
          setBoardState(JSON.parse(data.board))
        }

        setCurrentTurn(data.currentTurn || "white")
        setMoveHistory(data.moveHistory || [])
        setGameStatus(data.status)
        setLoading(false)
      } catch (error) {
        console.error("Error loading game:", error)
        setError("Failed to load game")
        setLoading(false)
      }
    }

    loadGame()
  }, [gameCode])

  // Separate useEffect for polling to avoid dependencies issues
  useEffect(() => {
    // Set up polling to check for opponent's moves
    const interval = setInterval(async () => {
      try {
        // Add a timestamp to prevent caching
        const timestamp = Date.now()
        if (timestamp - lastFetchTime < 1000) {
          // Don't fetch more than once per second
          return
        }

        setLastFetchTime(timestamp)

        const refreshedGameData = await getGame(gameCode)

        if (refreshedGameData && gameData) {
          // Check if the game data has changed
          const hasChanged =
            refreshedGameData.board !== gameData.board ||
            refreshedGameData.status !== gameData.status ||
            refreshedGameData.currentTurn !== gameData.currentTurn ||
            JSON.stringify(refreshedGameData.moveHistory) !== JSON.stringify(gameData.moveHistory)

          if (hasChanged) {
            console.log("Game updated from server:", refreshedGameData)
            // Game has been updated
            setGameData(refreshedGameData)

            // Update board state
            if (refreshedGameData.board !== "initial") {
              setBoardState(JSON.parse(refreshedGameData.board))
            }

            setCurrentTurn(refreshedGameData.currentTurn)
            setMoveHistory(refreshedGameData.moveHistory || [])
            setGameStatus(refreshedGameData.status)
          }
        }
      } catch (error) {
        console.error("Error polling game:", error)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameCode, gameData, lastFetchTime])

  const handleMove = async (from: string, to: string, newBoardState: any) => {
    // Update the board state
    setBoardState(newBoardState)

    // Switch turns
    const newTurn = currentTurn === "white" ? "black" : "white"
    setCurrentTurn(newTurn)

    // Add to move history
    const newMoveHistory = [...moveHistory, `${from} → ${to}`]
    setMoveHistory(newMoveHistory)

    // Save game state
    const updatedGameData = {
      ...gameData,
      board: JSON.stringify(newBoardState),
      currentTurn: newTurn,
      moveHistory: newMoveHistory,
      lastMoveTime: new Date().toISOString(),
    }

    setGameData(updatedGameData)

    try {
      await updateGame(gameCode, updatedGameData)
      console.log("Game updated after move")
    } catch (error) {
      console.error("Error updating game after move:", error)
      // Continue with local state even if server update fails
    }
  }

  const handleResign = async () => {
    if (confirm("Are you sure you want to resign?")) {
      try {
        // Update game status
        const updatedGameData = {
          ...gameData,
          status: "resigned",
          winner: opponentColor,
        }

        await updateGame(gameCode, updatedGameData)
        router.push("/")
      } catch (error) {
        console.error("Error resigning game:", error)
        alert("Failed to resign. Please try again.")
      }
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">Loading game...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500">{error}</div>
        <Link href="/" className="text-green-600 hover:underline mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <Link href="/" className="text-green-600 hover:underline">
          ← Back to Home
        </Link>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          Game Code: <span className="font-mono font-bold">{gameCode}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ChessBoard
            boardState={boardState}
            playerColor={playerColor}
            currentTurn={currentTurn}
            onMove={handleMove}
            readOnly={currentTurn !== playerColor || gameStatus !== "active"}
          />
        </div>

        <div className="space-y-6">
          <GameStatus gameStatus={gameStatus} currentTurn={currentTurn} playerColor={playerColor} />

          <MoveHistory moves={moveHistory} />

          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={handleResign} disabled={gameStatus !== "active"}>
              Resign
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
