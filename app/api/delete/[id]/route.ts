import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, dbGet, dbRun } from '@/lib/database'
import { deletePhoto } from '@/lib/fileUtils'
import fs from 'fs/promises'
import path from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    
    const photo = await dbGet('SELECT * FROM photos WHERE id = ?', [params.id]) as any
    
    if (!photo) {
      return new NextResponse('Photo not found', { status: 404 })
    }

    // Delete files from filesystem
    const filePath = path.join(process.cwd(), photo.filePath)
    const thumbnailPath = photo.thumbnailPath ? 
      path.join(process.cwd(), photo.thumbnailPath) : undefined
    
    await deletePhoto(filePath, thumbnailPath)

    // Delete from database
    await dbRun('DELETE FROM photos WHERE id = ?', [params.id])

    return new NextResponse('Photo deleted successfully', { status: 200 })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
