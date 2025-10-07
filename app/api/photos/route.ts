import { NextResponse } from 'next/server'
import { initDatabase, dbAll } from '@/lib/database'
import { Photo } from '@/types/photo'

export async function GET() {
  try {
    await initDatabase()
    
    const photos = await dbAll('SELECT * FROM photos ORDER BY dateTaken DESC') as Photo[]
    
    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}
