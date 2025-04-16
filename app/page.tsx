import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChessBoard } from "@/components/chess-board"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-green-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Chess Game</h1>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-4xl font-bold mb-6">Play Chess Online</h2>
          <p className="text-xl mb-8">Challenge your friends or play with random opponents</p>

          <div className="grid gap-4 md:grid-cols-2 max-w-md mx-auto">
            <Link href="/create-game">
              <Button className="w-full h-16 text-lg bg-green-600 hover:bg-green-700">Create Game</Button>
            </Link>
            <Link href="/join-game">
              <Button className="w-full h-16 text-lg bg-green-600 hover:bg-green-700">Join Game</Button>
            </Link>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4">Preview</h3>
            <div className="max-w-md mx-auto">
              <ChessBoard readOnly={true} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 p-4 text-center">
        <p className="text-gray-600">© {new Date().getFullYear()} Chess Game Clone</p>
      </footer>
    </div>
  )
}
