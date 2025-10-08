'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Calendar, FileText, Image as ImageIcon } from 'lucide-react'
import { Photo } from '@/types/photo'

interface PhotoGalleryProps {
  photos: Photo[]
  onPhotoDelete: (photoId: string) => void
}

export default function PhotoGallery({ photos, onPhotoDelete }: PhotoGalleryProps) {

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const response = await fetch(`/api/delete/${photoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onPhotoDelete(photoId)
      } else {
        console.error('Delete failed')
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
    }
  }

  const handleDownload = async (photoId: string) => {
    try {
      const response = await fetch(`/api/download/${photoId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `photo-${photoId}.jpg`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading photo:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }


  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
        <p className="text-gray-500">Upload your first progress photo to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Progress Photos Gallery</h2>
        <p className="text-gray-600">{photos.length} photo{photos.length !== 1 ? 's' : ''} in your collection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-12 bg-gray-200">
              <img
                src={`/api/image/${photo.id}`}
                alt={photo.customName || photo.originalName}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {photo.customName || photo.originalName}
              </h3>
              
              {photo.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {photo.description}
                </p>
              )}
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(photo.dateTaken)}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(photo.id)}
                    className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
