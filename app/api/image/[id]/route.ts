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

    // For Vercel, we'll return a placeholder image
    // In production, you'd serve from your storage solution
    const placeholderSvg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">
          Photo: ${photo.customName || photo.originalName}
        </text>
      </svg>
    `
    
    return new NextResponse(placeholderSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}