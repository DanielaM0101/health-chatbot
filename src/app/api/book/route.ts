import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('health_chatbot')
const bookContent = db.collection('book_content')

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chapter = searchParams.get('chapter')

  if (!chapter) {
    return NextResponse.json({ error: 'Chapter parameter is required' }, { status: 400 })
  }

  const content = await bookContent.findOne({ chapter: chapter })

  if (!content) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
  }

  return NextResponse.json(content)
}

