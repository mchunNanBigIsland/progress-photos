'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Camera, Calendar, FileText, Download } from 'lucide-react'
import PhotoUpload from '@/components/PhotoUpload'
import PhotoGallery from '@/components/PhotoGallery'
import { Photo } from '@/types/photo'

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload')
  const [loading, setLoading] = useState(true)

  // Load photos on component mount
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await fetch('/api/photos')
        if (response.ok) {
          const photosData = await response.json()
          setPhotos(photosData)
        }
      } catch (error) {
        console.error('Error loading photos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  const handlePhotoUpload = useCallback((newPhoto: Photo) => {
    setPhotos(prev => [newPhoto, ...prev])
  }, [])

  const handlePhotoDelete = useCallback((photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Progress Photos</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'upload'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-2 rounded-md font-medium ${
                  activeTab === 'gallery'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Gallery
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' ? (
          <PhotoUpload onPhotoUpload={handlePhotoUpload} />
        ) : (
          <PhotoGallery 
            photos={photos} 
            onPhotoDelete={handlePhotoDelete}
          />
        )}
      </main>
    </div>
  )
}