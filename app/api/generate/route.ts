import { NextResponse } from 'next/server';
import { articleRequestSchema, buildArticle } from '@/lib/generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = articleRequestSchema.safeParse({
      numberOfWords: Number(body.numberOfWords),
      location: body.location,
      field: body.field,
      audienceLevel: body.audienceLevel
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          issues: parsed.error.issues
        },
        { status: 400 }
      );
    }

    const result = buildArticle(parsed.data);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unexpected error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
