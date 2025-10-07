import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const response = await fetch(`${API_BASE_URL}/wines/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching wine details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wine details' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params
    const contentType = request.headers.get('content-type')

    let updateData: any = {}

    // Check if request contains FormData (with images)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()

      // Handle new images upload
      const newImages = formData.getAll('newImages')
      let uploadedImageUrls: string[] = []

      if (newImages.length > 0 && newImages[0] instanceof File) {
        const uploadFormData = new FormData()
        newImages.forEach((file) => {
          uploadFormData.append('images', file)
        })

        const uploadResponse = await fetch(`${API_BASE_URL}/upload/images`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          uploadedImageUrls = uploadResult.urls || []
        }
      }

      // Get existing images
      const existingImages = formData.getAll('images').filter(img => typeof img === 'string')

      // Combine images
      const allImages = [...existingImages, ...uploadedImageUrls]

      // Build update object from form data
      const fieldsToUpdate = [
        'title', 'description', 'price', 'annata', 'region', 'country',
        'producer', 'grapeVariety', 'alcoholContent', 'volume',
        'wineType', 'condition', 'quantity', 'status'
      ]

      fieldsToUpdate.forEach(field => {
        const value = formData.get(field)
        if (value !== null) {
          if (['price', 'annata', 'alcoholContent', 'volume', 'quantity'].includes(field)) {
            updateData[field] = Number(value)
          } else {
            updateData[field] = value
          }
        }
      })

      if (allImages.length > 0) {
        updateData.images = allImages
      }
    } else {
      // Handle JSON request
      updateData = await request.json()
    }

    const response = await fetch(`${API_BASE_URL}/wines/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error updating wine:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update wine' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params
    
    const response = await fetch(`${API_BASE_URL}/wines/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error deleting wine:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete wine' },
      { status: 500 }
    )
  }
}