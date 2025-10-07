'use client'

import { useState } from 'react'
import { Calendar, FileText, Download, Trash2, Eye, Search, X } from 'lucide-react'
import { Photo } from '@/types/photo'
import { format } from 'date-fns'

interface PhotoGalleryProps {
  photos: Photo[]
  onPhotoDelete: (photoId: string) => void
}

export default function PhotoGallery({ photos, onPhotoDelete }: PhotoGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = !searchTerm || 
      photo.customName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.originalName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDate = !selectedDate || photo.dateTaken.startsWith(selectedDate)
    
    return matchesSearch && matchesDate
  })

  const groupedPhotos = filteredPhotos.reduce((groups, photo) => {
    const date = photo.dateTaken.split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(photo)
    return groups
  }, {} as Record<string, Photo[]>)

  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(`/api/download/${photo.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = photo.customName || photo.originalName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDelete = async (photo: Photo) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        const response = await fetch(`/api/delete/${photo.id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          onPhotoDelete(photo.id)
        }
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
        <p className="text-gray-600">View and manage your progress photos</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="h-4 w-4 inline mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedDate('')
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Photo Groups */}
      {Object.keys(groupedPhotos).length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No photos found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedPhotos)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, datePhotos]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {format(new Date(date), 'EEEE, MMMM do, yyyy')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {datePhotos.map((photo) => (
                  <div key={photo.id} className="photo-card bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={`/api/image/${photo.id}`}
                        alt={photo.customName || photo.originalName}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          onClick={() => setSelectedPhoto(photo)}
                          className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(photo)}
                          className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(photo)}
                          className="bg-red-600 bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 truncate">
                        {photo.customName || photo.originalName}
                      </h4>
                      {photo.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {photo.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {format(new Date(photo.dateTaken), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {selectedPhoto.customName || selectedPhoto.originalName}
              </h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={`/api/image/${selectedPhoto.id}`}
                alt={selectedPhoto.customName || selectedPhoto.originalName}
                className="max-w-full max-h-[60vh] object-contain mx-auto"
              />
              {selectedPhoto.description && (
                <p className="mt-4 text-gray-700">{selectedPhoto.description}</p>
              )}
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>Date: {format(new Date(selectedPhoto.dateTaken), 'PPpp')}</span>
                <span>Size: {(selectedPhoto.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
