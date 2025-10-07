import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api'

export async function POST(request: NextRequest) {
  try {
    console.log('🛒 Cart API: POST request received')

    const session = await getServerSession(authOptions)
    console.log('🔐 Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasAccessToken: !!session?.accessToken,
      userId: session?.user?.id
    })

    if (!session?.accessToken) {
      console.log('❌ Cart API: No access token found')
      return NextResponse.json(
        { error: 'Unauthorized - Please login again' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📦 Cart API: Request body:', body)

    const response = await fetch(`${API_BASE_URL}/orders/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    })

    console.log('📡 Backend API response:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      console.error('❌ Backend API error:', errorData)

      return NextResponse.json(
        { error: errorData.message || 'Failed to add to cart' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Cart API: Success:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Cart API: Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}