import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, deletePhoto } from '@/lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    
    await deletePhoto(params.id)

    return new NextResponse('Photo deleted successfully', { status: 200 })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}