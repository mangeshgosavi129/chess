"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getGame, updateGame } from "@/lib/game-service"

export default function JoinGame() {
  const router = useRouter()
  const [gameCode, setGameCode] = useState("")
  const [error, setError] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinGame = async () => {
    if (!gameCode.trim()) {
      setError("Please enter a game code")
      return
    }

    setIsJoining(true)
    try {
      // Check if game exists
      const gameData = await getGame(gameCode)

      if (!gameData) {
        setError("Game not found. Please check the code and try again.")
        setIsJoining(false)
        return
      }

      // Join the game
      if (gameData.status !== "waiting") {
        setError("This game is no longer available to join.")
        setIsJoining(false)
        return
      }

      // Update game status
      gameData.status = "active"
      await updateGame(gameCode, gameData)

      // Store player info
      localStorage.setItem(
        `player_${gameCode}`,
        JSON.stringify({
          playerColor: gameData.playerColor === "white" ? "black" : "white",
          isCreator: false,
        }),
      )

      // Navigate to the game
      router.push(`/game/${gameCode}`)
    } catch (error) {
      console.error("Error joining game:", error)
      setError("Failed to join game. Please try again.")
      setIsJoining(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Link href="/" className="text-green-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Join a Game</CardTitle>
          <CardDescription>Enter the game code provided by your friend</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameCode">Game Code</Label>
              <Input
                id="gameCode"
                placeholder="Enter 6-digit code"
                value={gameCode}
                onChange={(e) => {
                  setGameCode(e.target.value.toUpperCase())
                  setError("")
                }}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleJoinGame} disabled={isJoining}>
            {isJoining ? "Joining..." : "Join Game"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
