import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

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
  
  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL === '1'
  
  if (isVercel) {
    // For Vercel, use a simple structure in /tmp
    const extension = originalName.split('.').pop() || 'jpg'
    const baseName = customName ? 
      customName.replace(/[^a-zA-Z0-9-_]/g, '_') : 
      originalName.split('.')[0]
    
    const filename = `${baseName}.${extension}`
    const filePath = `/tmp/${filename}`
    
    // In Vercel, we'll simulate file saving
    return { filePath, filename }
  } else {
    // Local development - use custom directory structure
    const baseDir = 'C:\\Users\\mchun\\OneDrive - Nan Inc\\Desktop\\OneDrive - Nan Inc\\24-077_Hilo_WWTP_PH1\\J8_Pics\\J80-Progress'
    const yearDir = path.join(baseDir, year.toString())
    const monthDir = path.join(yearDir, month)
    const dayDir = path.join(monthDir, day)
    
    // Ensure directories exist
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true })
    }
    if (!fs.existsSync(monthDir)) {
      fs.mkdirSync(monthDir, { recursive: true })
    }
    if (!fs.existsSync(dayDir)) {
      fs.mkdirSync(dayDir, { recursive: true })
    }
    
    const extension = originalName.split('.').pop() || 'jpg'
    const baseName = customName ? 
      customName.replace(/[^a-zA-Z0-9-_]/g, '_') : 
      originalName.split('.')[0]
    
    const filename = `${baseName}.${extension}`
    const fullPath = path.join(dayDir, filename)
    
    // Write the file to the custom directory
    fs.writeFileSync(fullPath, file)
    
    return { filePath: fullPath, filename }
  }
}

export async function createThumbnail(
  filePath: string,
  photoId: string
): Promise<string> {
  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL === '1'
  
  if (isVercel) {
    // For Vercel, create thumbnails in /tmp
    const thumbnailPath = `/tmp/thumbnails/${photoId}.jpg`
    return thumbnailPath
  } else {
    // Local development - create thumbnails in custom directory
    const baseDir = 'C:\\Users\\mchun\\OneDrive - Nan Inc\\Desktop\\OneDrive - Nan Inc\\24-077_Hilo_WWTP_PH1\\J8_Pics\\J80-Progress'
    const thumbnailsDir = path.join(baseDir, 'thumbnails')
    
    // Ensure thumbnails directory exists
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true })
    }
    
    const thumbnailPath = path.join(thumbnailsDir, `${photoId}.jpg`)
    
    try {
      // Create thumbnail using sharp
      await sharp(filePath)
        .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath)
    } catch (error) {
      console.error('Error creating thumbnail:', error)
    }
    
    return thumbnailPath
  }
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

export async function createDescriptionFile(
  filePath: string,
  customName: string,
  description: string,
  dateTaken: string
): Promise<string> {
  const descriptionPath = filePath.replace(/\.[^/.]+$/, '_description.txt')
  
  const descriptionContent = `Photo Description
================

Photo Name: ${customName}
Date Taken: ${new Date(dateTaken).toLocaleDateString()}
Description: ${description}

File Path: ${filePath}
Created: ${new Date().toLocaleString()}

---
This description file is linked to the photo: ${path.basename(filePath)}
`
  
  fs.writeFileSync(descriptionPath, descriptionContent)
  return descriptionPath
}

export async function deletePhoto(filePath: string, thumbnailPath?: string) {
  try {
    // Delete the main photo file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`Deleted photo: ${filePath}`)
    }
    
    // Delete the thumbnail if it exists
    if (thumbnailPath && fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath)
      console.log(`Deleted thumbnail: ${thumbnailPath}`)
    }
    
    // Delete the description file if it exists
    const descriptionPath = filePath.replace(/\.[^/.]+$/, '_description.txt')
    if (fs.existsSync(descriptionPath)) {
      fs.unlinkSync(descriptionPath)
      console.log(`Deleted description: ${descriptionPath}`)
    }
  } catch (error) {
    console.error('Error deleting files:', error)
  }
}
