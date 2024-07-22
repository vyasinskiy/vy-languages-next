import prisma from '@lib/prisma';
import { ZodTypeAny, z } from 'zod';
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from '@prisma/client';
import { DEV_USER_ID } from '@/app/lib/constants';
import { getTranslationsDbItems } from '@/app/lib/queries/playground';
import { mapTranslationDbItemToPlaygroundItem } from '@/app/lib/tools/playground';
import { PlaygroundItem } from '@/app/lib/types/playground';

export interface ProgressUiRequestBody {
    translationId: number;
    isAnswered: boolean;
    isFavorite: boolean;
}

export interface ProgressQueryRequestBody {
    translation_id: number;
    is_answered: boolean;
    is_favorite: boolean;
}

export type UpdateTranslationUiRequestBody = Omit<PlaygroundItem, 'isFavorite'>;

const ProgressValidationSchema = z.object<Record<keyof ProgressUiRequestBody, ZodTypeAny>>({
    translationId: z.number(),
    isAnswered: z.boolean(),
    isFavorite: z.boolean(),
});

export async function GET(req: NextRequest) {
    try {
        const ignorIds = req.nextUrl.searchParams.get('ignoreIds')?.split(',').map(id => +id) ?? [];
        const translations = await getTranslationsDbItems(ignorIds);
        const playgroundItems = translations.map(t => mapTranslationDbItemToPlaygroundItem(t));
        return NextResponse.json({ Success: true, data: playgroundItems });
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message);
        } else {
            console.error(error);
        }
        return NextResponse.json({ Success: false }, {status: 500})
    }
}

export async function POST(req: NextRequest) {
    const result = ProgressValidationSchema.safeParse(await req.json());
    if (!result.success || !result.data) {
        return NextResponse.json(result.error, { status: 400 });
    }

    const reqBody = {
        user_id: DEV_USER_ID,
        translation_id: result.data.translationId,
        is_answered: result.data.isAnswered,
    };

    let isSuccess = false;

    try {
        await prisma.progress.create({ data: reqBody })
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const isConstraintViolation = error.code === "P2002";
            if (isConstraintViolation) {
                isSuccess = await updateTranslationProgress(result.data as ProgressUiRequestBody);
            }
            console.error(error.message);
        } else {
            console.error(error);
        }
    }

   return NextResponse.json({ Success: isSuccess });
}

export async function PUT(req: NextRequest) {
    const result = ProgressValidationSchema.safeParse(await req.json());
    if (!result.success || !result.data) {
        return NextResponse.json(result.error, { status: 400 });
    }

    const data = {
        user_id: DEV_USER_ID,
        translation_id: result.data.translationId,
        is_favorite: result.data.isFavorite,
    };

    let isSuccess = false;

    try {
        await prisma.progress.create({ data });
        isSuccess = true;
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const isConstraintViolation = error.code === "P2002";
            if (isConstraintViolation) {
                isSuccess = await updateTranslationProgress(result.data as ProgressUiRequestBody);
            }
        } else {
            console.error(error, req);
        }
    }

    return NextResponse.json({ Success: isSuccess });
}

const updateTranslationProgress = async (reqBody: ProgressUiRequestBody): Promise<boolean> => {    
    const data = {
        user_id: DEV_USER_ID,
        translation_id: reqBody.translationId,
        is_favorite: reqBody.isFavorite,
        is_answered: reqBody.isAnswered,
    };
    
    const where = {
        user_id_translation_id: {
            user_id: DEV_USER_ID,
            translation_id: data.translation_id,
        }
    };

    let isSuccess = false;

    try {
        await prisma.progress.update({ data, where });
        isSuccess = true;
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error(error.message, reqBody);
        } else {
            console.error(error, reqBody);
        }
    }

    return isSuccess;
}
