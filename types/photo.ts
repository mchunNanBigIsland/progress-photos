export interface Photo {
  id: string
  filename: string
  originalName: string
  customName?: string
  description?: string
  dateTaken: string
  uploadDate: string
  filePath: string
  thumbnailPath: string
  fileSize: number
  width?: number
  height?: number
}

export interface PhotoUploadData {
  file: File
  customName: string
  description: string
  dateTaken: string
}
