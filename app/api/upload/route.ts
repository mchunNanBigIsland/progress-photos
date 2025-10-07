import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, dbRun } from '@/lib/database'
import { savePhoto, createThumbnail, getImageMetadata } from '@/lib/fileUtils'
import { Photo } from '@/types/photo'

export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const customName = formData.get('customName') as string
    const description = formData.get('description') as string
    const dateTaken = formData.get('dateTaken') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save photo to date-based folder
    const { filePath, filename } = await savePhoto(
      buffer,
      file.name,
      dateTaken || new Date().toISOString(),
      customName || undefined
    )

    // Create thumbnail
    const thumbnailPath = await createThumbnail(filePath, filename.split('_')[1])

    // Get image metadata
    const metadata = await getImageMetadata(filePath)

    // Save to database
    const photoId = filename.split('_')[1].split('.')[0]
    const photo: Photo = {
      id: photoId,
      filename,
      originalName: file.name,
      customName: customName || undefined,
      description: description || undefined,
      dateTaken: dateTaken || new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      filePath,
      thumbnailPath,
      fileSize: file.size,
      width: metadata.width,
      height: metadata.height,
    }

    await dbRun(`
      INSERT INTO photos (
        id, filename, originalName, customName, description, 
        dateTaken, uploadDate, filePath, thumbnailPath, 
        fileSize, width, height
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      photo.id, photo.filename, photo.originalName, photo.customName,
      photo.description, photo.dateTaken, photo.uploadDate, photo.filePath,
      photo.thumbnailPath, photo.fileSize, photo.width, photo.height
    ])

    return NextResponse.json(photo)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    )
  }
}
