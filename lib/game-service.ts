// Create a new game
export async function createGame(gameCode: string, playerColor: string) {
  const gameData = {
    createdAt: new Date().toISOString(),
    playerColor,
    board: "initial",
    status: "waiting",
    currentTurn: "white", // Chess always starts with white
    moveHistory: [],
  }

  try {
    const response = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameCode, gameData }),
    })

    if (!response.ok) {
      throw new Error("Failed to create game")
    }

    // Also store in localStorage as a fallback
    localStorage.setItem(`game_${gameCode}`, JSON.stringify(gameData))

    return gameData
  } catch (error) {
    console.error("Error creating game:", error)
    // Fallback to localStorage only
    localStorage.setItem(`game_${gameCode}`, JSON.stringify(gameData))
    return gameData
  }
}

// Get a game by code
export async function getGame(gameCode: string) {
  try {
    const response = await fetch(`/api/games?code=${gameCode}`, {
      // Add cache: 'no-store' to prevent caching
      cache: "no-store",
      // Add a timestamp to prevent caching
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (response.status === 404) {
      // Try to get from localStorage as fallback
      const localData = localStorage.getItem(`game_${gameCode}`)
      if (localData) {
        return JSON.parse(localData)
      }
      return null
    }

    if (!response.ok) {
      throw new Error("Failed to fetch game")
    }

    const data = await response.json()
    return data.gameData
  } catch (error) {
    console.error("Error fetching game:", error)
    // Fallback to localStorage
    const localData = localStorage.getItem(`game_${gameCode}`)
    return localData ? JSON.parse(localData) : null
  }
}

// Update a game
export async function updateGame(gameCode: string, gameData: any) {
  try {
    const response = await fetch("/api/games", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
      body: JSON.stringify({ gameCode, gameData }),
    })

    if (!response.ok) {
      throw new Error("Failed to update game")
    }

    // Also update localStorage as a fallback
    localStorage.setItem(`game_${gameCode}`, JSON.stringify(gameData))

    return gameData
  } catch (error) {
    console.error("Error updating game:", error)
    // Fallback to localStorage only
    localStorage.setItem(`game_${gameCode}`, JSON.stringify(gameData))
    return gameData
  }
}
