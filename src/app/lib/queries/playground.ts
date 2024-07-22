import prisma from '@lib/prisma';

export const getTranslationsDbItems = async (ignoreIds: number[]) => {
    const translations = await prisma.translations.findMany({
        take: 10,
        include: {
            progress: true,
            words_translations_word_id_fromTowords: true,
            words_translations_word_id_toTowords: true,
        },
        where: {
            words_translations_word_id_fromTowords: {
                language_id: 3,
            },
            progress: {
                none: {
                    is_answered: true,
                },
            }
        },
      })

    return translations;
}