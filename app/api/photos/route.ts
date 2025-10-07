import { NextResponse } from 'next/server'
import { initDatabase, getAllPhotos } from '@/lib/database'

export async function GET() {
  try {
    await initDatabase()
    
    const photos = await getAllPhotos()
    
    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}