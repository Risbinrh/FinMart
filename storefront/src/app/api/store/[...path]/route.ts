import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_427cce2a75049dde35ff19cb44f3fc18cc1109893df8c6870064cf64bbff283e';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${MEDUSA_BACKEND_URL}/store/${path.join('/')}${searchParams ? `?${searchParams}` : ''}`;

    console.log('[API Proxy] GET:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${MEDUSA_BACKEND_URL}/store/${path.join('/')}${searchParams ? `?${searchParams}` : ''}`;

    console.log('[API Proxy] POST:', url);

    let body;
    try {
        body = await request.json();
    } catch {
        body = {};
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const url = `${MEDUSA_BACKEND_URL}/store/${path.join('/')}`;

    console.log('[API Proxy] DELETE:', url);

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}
