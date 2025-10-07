import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, getPhotoById } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    
    const photo = await getPhotoById(params.id)
    
    if (!photo) {
      return new NextResponse('Photo not found', { status: 404 })
    }

    // For Vercel, we'll return a placeholder
    // In production, you'd serve the actual file from storage
    const placeholderText = `Photo: ${photo.customName || photo.originalName}\nDescription: ${photo.description || 'No description'}\nDate: ${photo.dateTaken}`
    
    return new NextResponse(placeholderText, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${photo.customName || photo.originalName}.txt"`,
      },
    })
  } catch (error) {
    console.error('Error downloading image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}