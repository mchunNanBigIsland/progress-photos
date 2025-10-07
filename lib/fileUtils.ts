import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

export async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

export function generatePhotoId(): string {
  return uuidv4()
}

export async function savePhoto(
  file: Buffer,
  originalName: string,
  dateTaken: string,
  customName?: string
): Promise<{ filePath: string; filename: string }> {
  const photoId = generatePhotoId()
  const date = new Date(dateTaken)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  // Create date-based folder structure: YYYY/MM/DD
  const dateFolder = path.join('uploads', String(year), month, day)
  await ensureDirectoryExists(dateFolder)
  
  // Generate filename
  const extension = path.extname(originalName)
  const baseName = customName ? 
    customName.replace(/[^a-zA-Z0-9-_]/g, '_') : 
    path.basename(originalName, extension)
  
  const filename = `${baseName}_${photoId}${extension}`
  const filePath = path.join(dateFolder, filename)
  
  // Save the file
  await fs.writeFile(filePath, file)
  
  return { filePath, filename }
}

export async function createThumbnail(
  filePath: string,
  photoId: string
): Promise<string> {
  const thumbnailDir = path.join('uploads', 'thumbnails')
  await ensureDirectoryExists(thumbnailDir)
  
  const thumbnailPath = path.join(thumbnailDir, `${photoId}.jpg`)
  
  await sharp(filePath)
    .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath)
  
  return thumbnailPath
}

export async function getImageMetadata(filePath: string) {
  try {
    const metadata = await sharp(filePath).metadata()
    return {
      width: metadata.width,
      height: metadata.height,
    }
  } catch {
    return { width: undefined, height: undefined }
  }
}

export async function deletePhoto(filePath: string, thumbnailPath?: string) {
  try {
    await fs.unlink(filePath)
    if (thumbnailPath) {
      await fs.unlink(thumbnailPath)
    }
  } catch (error) {
    console.error('Error deleting files:', error)
  }
}
