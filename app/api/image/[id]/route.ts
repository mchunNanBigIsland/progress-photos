import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, getPhotoById } from '@/lib/database'
import fs from 'fs'
import path from 'path'

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

    // Check if the file exists in the custom directory
    if (fs.existsSync(photo.filePath)) {
      const fileBuffer = fs.readFileSync(photo.filePath)
      const fileExtension = path.extname(photo.filePath).toLowerCase()
      
      let contentType = 'image/jpeg'
      if (fileExtension === '.png') contentType = 'image/png'
      else if (fileExtension === '.gif') contentType = 'image/gif'
      else if (fileExtension === '.webp') contentType = 'image/webp'
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }

    // Check if it's a cloud storage path (Vercel deployment)
    if (photo.filePath.startsWith('cloud://')) {
      // For now, return a placeholder image
      const placeholderSvg = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f3f4f6"/>
          <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">
            Cloud Storage: ${photo.customName || photo.originalName}
          </text>
          <text x="200" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="#9ca3af">
            (File saved to cloud storage)
          </text>
        </svg>
      `
      
      return new NextResponse(placeholderSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }

    // Fallback to placeholder if file doesn't exist
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