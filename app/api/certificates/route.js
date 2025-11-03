import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        issueDate: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}