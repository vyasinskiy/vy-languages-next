import { ZodTypeAny, z } from 'zod';
import { NextRequest, NextResponse } from "next/server";
import prisma from '@lib/prisma';
import { Prisma } from '@prisma/client';

export interface DeleteTranslationUiRequestBody {
    translationId: number,
}

const DeleteTranslationValidationSchema = z.object<Record<keyof DeleteTranslationUiRequestBody, ZodTypeAny>>({
    translationId: z.number(),
});

export async function DELETE(req: NextRequest) {
    const result = DeleteTranslationValidationSchema.safeParse(await req.json());
    if (!result.success || !result.data) {
        return NextResponse.json(result.error, { status: 400 });
    }

    const deleteBody = {
        where: {
            translation_id: result.data.translationId,
        }
    };

    let isSuccess = false;

    try {
        await prisma.translations.delete(deleteBody);
        isSuccess = true;
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
        } else {
            console.error(error, req);
        }
    }

    return NextResponse.json({ Success: isSuccess })
}