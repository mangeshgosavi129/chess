"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { generateGameCode } from "@/lib/game-utils"
import { createGame } from "@/lib/game-service"

export default function CreateGame() {
  const router = useRouter()
  const [color, setColor] = useState("white")
  const [gameCode, setGameCode] = useState("")
  const [gameCreated, setGameCreated] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateGame = async () => {
    setIsCreating(true)
    try {
      const code = generateGameCode()
      await createGame(code, color)
      setGameCode(code)
      setGameCreated(true)
    } catch (error) {
      console.error("Error creating game:", error)
      alert("Failed to create game. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleStartGame = () => {
    router.push(`/game/${gameCode}`)
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Link href="/" className="text-green-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Game</CardTitle>
          <CardDescription>Set up a new chess game and invite a friend to play</CardDescription>
        </CardHeader>

        <CardContent>
          {!gameCreated ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Choose your color</h3>
                <RadioGroup value={color} onValueChange={setColor} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="white" id="white" />
                    <Label htmlFor="white" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                        <span className="text-xl">♔</span>
                      </div>
                      White
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="black" id="black" />
                    <Label htmlFor="black" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-xl text-white">♚</span>
                      </div>
                      Black
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Game Created!</h3>
                <p className="text-sm text-gray-500 mb-4">Share this code with your opponent</p>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <span className="text-2xl font-mono font-bold tracking-wider">{gameCode}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {!gameCreated ? (
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleCreateGame} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Game"}
            </Button>
          ) : (
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleStartGame}>
              Start Game
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
