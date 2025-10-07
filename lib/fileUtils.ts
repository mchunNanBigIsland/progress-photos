import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

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
  
  // For Vercel, we'll store in a simple structure
  const extension = originalName.split('.').pop() || 'jpg'
  const baseName = customName ? 
    customName.replace(/[^a-zA-Z0-9-_]/g, '_') : 
    originalName.split('.')[0]
  
  const filename = `${baseName}_${photoId}.${extension}`
  const filePath = `uploads/${year}/${month}/${day}/${filename}`
  
  return { filePath, filename }
}

export async function createThumbnail(
  filePath: string,
  photoId: string
): Promise<string> {
  const thumbnailPath = `uploads/thumbnails/${photoId}.jpg`
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
  // For Vercel, we'll handle file deletion differently
  // This is a placeholder - in production you'd delete from storage
  console.log(`Would delete: ${filePath}`)
  if (thumbnailPath) {
    console.log(`Would delete thumbnail: ${thumbnailPath}`)
  }
}