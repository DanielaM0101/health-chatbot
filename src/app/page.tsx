'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageCircle } from 'lucide-react'
import Image from 'next/image'

export default function HealthChatbot() {
  const [showEmergency, setShowEmergency] = useState(false)
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.toLowerCase().includes('emergencia')) {
      setShowEmergency(true)
    }
    handleSubmit(e)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white p-4 flex items-center">
        <Image src="/bermal1.png" alt="Bermal Logo" width={32} height={32} className="mr-2" />
        <h1 className="text-xl  font-bold text-red-500">Bermal</h1>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-700 text-white">
          <CardHeader className="border-b border-gray-600 p-4">
            <div className="flex items-center">
              <Image src="/bermal1.png" alt="Bermal Logo" width={24} height={24} className="mr-2" />
              <h2 className="text-lg font-semibold">Ayuda Bermal Comunidad Azuay</h2>
            </div>
          </CardHeader>
          <CardContent className="h-[60vh] overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <MessageCircle className="w-16 h-16 text-gray-500 mr-2" />
                <MessageCircle className="w-16 h-16 text-gray-500" />
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'}`}>
                  {m.content}
                </span>
              </div>
            ))}
            {showEmergency && (
              <div className="bg-red-600 text-white px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">¡Atención!</strong>
                <span className="block sm:inline"> Si es una emergencia, por favor llame inmediatamente al servicio de emergencias.</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-gray-600 p-4">
            <form onSubmit={onSubmit} className="flex w-full">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Haz una pregunta sobre primeros Auxilios"
                className="flex-grow mr-2 bg-gray-800 border-gray-600 text-white"
              />
              <Button type="submit" className="bg-gray-800 hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

