import { ZodTypeAny, z } from 'zod';
import { NextRequest, NextResponse } from "next/server";
import prisma from '@lib/prisma';
import { Prisma } from '@prisma/client';

export interface UpdateWordUiRequestBody {
    wordIdFrom: number;
    wordFrom: string;
    exampleFrom: string;
    wordIdTo: number;
    wordTo: string;
    exampleTo: string;
}

const WordUpdateValidationSchema = z.object<Record<keyof UpdateWordUiRequestBody, ZodTypeAny>>({
    wordIdFrom: z.number(),
    wordFrom: z.string(),
    exampleFrom: z.string(),
    wordIdTo: z.number(),
    wordTo: z.string(),
    exampleTo: z.string(),
});

export async function PUT(req: NextRequest) {
    const result = WordUpdateValidationSchema.safeParse(await req.json());
    if (!result.success || !result.data) {
        return NextResponse.json(result.error, { status: 400 });
    }

    const wordFromUpdateBody = {
        data: {
            word: result.data.wordFrom,
            word_example: result.data.exampleFrom,
        },
        where: {
            word_id: result.data.wordIdFrom,
        }
    };

    const wordToUpdateBody = {
        data: {
            word: result.data.wordTo,
            word_example: result.data.exampleTo,
        },
        where: {
            word_id: result.data.wordIdTo,
        }
    };

    let isSuccess = false;

    try {
        await prisma.words.update(wordFromUpdateBody);
        await prisma.words.update(wordToUpdateBody);
        isSuccess = true;
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
        } else {
            console.error(error, req);
        }
    }

    return NextResponse.json({ Success: isSuccess })
}