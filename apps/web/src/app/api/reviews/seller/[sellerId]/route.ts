import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { sellerId: string } }
) {
  try {
    const { sellerId } = params;
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const response = await fetch(
      `${API_BASE_URL}/reviews/seller/${sellerId}${queryString ? `?${queryString}` : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seller reviews' },
      { status: 500 }
    );
  }
}
