import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import path from 'path'

// Cargar variables de entorno
config({ path: path.resolve(process.cwd(), '.env') })

console.log('Current working directory:', process.cwd())
console.log('Attempting to load MONGODB_URI from:', path.resolve(process.cwd(), '.env'))
console.log('MONGODB_URI:', process.env.MONGODB_URI)

// Permitir respuestas de streaming de hasta 2 minutos
export const maxDuration = 120

// Verificación de la variable de entorno
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is undefined. Please check your .env.local file.')
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

// Conexión a MongoDB
let client: MongoClient
let db: any
let knowledgeBase: any

try {
  client = new MongoClient(process.env.MONGODB_URI)
  db = client.db('health_chatbot')
  knowledgeBase = db.collection('knowledge_base')
} catch (error) {
  console.error('Error connecting to MongoDB:', error)
  throw new Error('Failed to connect to MongoDB. Please check your MONGODB_URI.')
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    // Buscar información relevante en la base de conocimientos
    const lastMessage = messages[messages.length - 1].content
    const relevantInfo = await knowledgeBase.findOne({ keywords: { $in: lastMessage.split(' ') } })

    const systemMessage = `Eres un asistente de salud AI. Proporciona información precisa y útil sobre primeros auxilios y salud general. 
    Si es una emergencia, recomienda buscar ayuda profesional inmediatamente. 
    Información adicional relevante: ${relevantInfo ? relevantInfo.content : 'No se encontró información adicional.'}`

    const result = streamText({
      model: openai('gpt-4-turbo'),
      messages: [{ role: 'system', content: systemMessage }, ...messages],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in chat API:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

