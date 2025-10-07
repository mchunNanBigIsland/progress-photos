'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Calendar, FileText, Image as ImageIcon } from 'lucide-react'
import { Photo, PhotoUploadData } from '@/types/photo'

interface PhotoUploadProps {
  onPhotoUpload: (photo: Photo) => void
}

export default function PhotoUpload({ onPhotoUpload }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadData, setUploadData] = useState<PhotoUploadData[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    const newUploadData = imageFiles.map(file => ({
      file,
      customName: '',
      description: '',
      dateTaken: new Date().toISOString().split('T')[0]
    }))
    setUploadData(prev => [...prev, ...newUploadData])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const updateUploadData = (index: number, field: keyof PhotoUploadData, value: string) => {
    setUploadData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const removeUploadData = (index: number) => {
    setUploadData(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadData.length === 0) return

    setUploading(true)
    try {
      for (const data of uploadData) {
        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('customName', data.customName || '')
        formData.append('description', data.description || '')
        formData.append('dateTaken', data.dateTaken || new Date().toISOString())

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const photo: Photo = await response.json()
          onPhotoUpload(photo)
        } else {
          console.error('Upload failed')
        }
      }
      setUploadData([])
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Progress Photos</h2>
        <p className="text-gray-600">Add metadata to organize your photos by date and project</p>
      </div>

      {/* Upload Area */}
      <div
        className={`upload-area ${dragActive ? 'dragover' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drag and drop photos here, or click to select
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supports JPG, PNG, GIF, and other image formats
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Data Forms */}
      {uploadData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Details ({uploadData.length} photo{uploadData.length !== 1 ? 's' : ''})
          </h3>
          {uploadData.map((data, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={URL.createObjectURL(data.file)}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{data.file.name}</span>
                    <button
                      onClick={() => removeUploadData(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FileText className="h-4 w-4 inline mr-1" />
                        Custom Name
                      </label>
                      <input
                        type="text"
                        value={data.customName}
                        onChange={(e) => updateUploadData(index, 'customName', e.target.value)}
                        placeholder="Enter a custom name for this photo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Date Taken
                      </label>
                      <input
                        type="date"
                        value={data.dateTaken}
                        onChange={(e) => updateUploadData(index, 'dateTaken', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={data.description}
                      onChange={(e) => updateUploadData(index, 'description', e.target.value)}
                      placeholder="Add a description for this photo..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setUploadData([])}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : `Upload ${uploadData.length} Photo${uploadData.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}