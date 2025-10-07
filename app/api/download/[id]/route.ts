import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, dbGet } from '@/lib/database'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    
    const photo = await dbGet('SELECT * FROM photos WHERE id = ?', [params.id]) as any
    
    if (!photo) {
      return new NextResponse('Photo not found', { status: 404 })
    }

    const filePath = path.join(process.cwd(), photo.filePath)
    
    try {
      const fileBuffer = await fs.readFile(filePath)
      const contentType = getContentType(photo.filename)
      const downloadName = photo.customName || photo.originalName
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${downloadName}"`,
        },
      })
    } catch (error) {
      return new NextResponse('File not found', { status: 404 })
    }
  } catch (error) {
    console.error('Error downloading image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  }
  return contentTypes[ext] || 'application/octet-stream'
}
