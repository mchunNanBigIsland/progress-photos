import { Photo } from '@/types/photo'

// Simple in-memory storage for Vercel deployment
// In production, you'd want to use a proper database like PostgreSQL
let photos: Photo[] = []

export async function initDatabase() {
  // No-op for in-memory storage
  return Promise.resolve()
}

export async function savePhoto(photo: Photo): Promise<void> {
  photos.push(photo)
}

export async function getAllPhotos(): Promise<Photo[]> {
  return photos
}

export async function deletePhoto(photoId: string): Promise<void> {
  photos = photos.filter(photo => photo.id !== photoId)
}

export async function getPhotoById(photoId: string): Promise<Photo | null> {
  return photos.find(photo => photo.id === photoId) || null
}