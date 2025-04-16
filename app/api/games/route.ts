import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Create a data directory if it doesn't exist
const DATA_DIR = path.join(process.cwd(), "data")
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// File path for storing games
const GAMES_FILE = path.join(DATA_DIR, "games.json")

// Initialize games file if it doesn't exist
if (!fs.existsSync(GAMES_FILE)) {
  fs.writeFileSync(GAMES_FILE, JSON.stringify({}), "utf8")
}

// Helper function to read games from file
function readGames() {
  try {
    const data = fs.readFileSync(GAMES_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading games file:", error)
    return {}
  }
}

// Helper function to write games to file
function writeGames(games: any) {
  try {
    fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2), "utf8")
  } catch (error) {
    console.error("Error writing games file:", error)
  }
}

export async function POST(request: Request) {
  const data = await request.json()
  const { gameCode, gameData } = data

  // Read existing games
  const games = readGames()

  // Store the game data
  games[gameCode] = gameData

  // Write updated games back to file
  writeGames(games)

  return NextResponse.json({ success: true })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gameCode = searchParams.get("code")

  if (!gameCode) {
    return NextResponse.json({ error: "Game code is required" }, { status: 400 })
  }

  // Read games from file
  const games = readGames()
  const gameData = games[gameCode]

  if (!gameData) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }

  return NextResponse.json({ gameData })
}

export async function PUT(request: Request) {
  const data = await request.json()
  const { gameCode, gameData } = data

  // Read existing games
  const games = readGames()

  if (!games[gameCode]) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 })
  }

  // Update the game data
  games[gameCode] = gameData

  // Write updated games back to file
  writeGames(games)

  return NextResponse.json({ success: true })
}
