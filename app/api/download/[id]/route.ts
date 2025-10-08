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
      
      const downloadFilename = photo.customName ? 
        `${photo.customName}${fileExtension}` : 
        photo.originalName
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        },
      })
    }

    // Fallback to placeholder if file doesn't exist
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