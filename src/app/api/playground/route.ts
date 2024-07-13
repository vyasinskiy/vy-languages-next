import prisma from '@lib/prisma';
import { ZodTypeAny, z } from 'zod';
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from '@prisma/client'

export interface UpdateWordRequestBody {
    translationName: string;
    isAnswered: boolean;
    isFavorite: boolean;
}

const updateSchema = z.object<Record<keyof UpdateWordRequestBody, ZodTypeAny>>({
    translationName: z.string(),
    isAnswered: z.boolean(),
    isFavorite: z.boolean(),
});

export async function PUT(req: NextRequest) {
    const result = updateSchema.safeParse(await req.json());
    if (!result.success || !result.data) {
        return NextResponse.json(result.error, { status: 400 });
    }

    try {
        await prisma.progress.create({
            data: {
                user_id: 1,
                translation_name: result.data.translationName,
                is_answered: result.data.isAnswered,
                is_favorite: result.data.isFavorite,
            }
        })
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        return NextResponse.json({ Success: false }, {status: 500})
    }

   
    return NextResponse.json({ Success: true });
}