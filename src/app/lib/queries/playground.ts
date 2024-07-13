import prisma from '@lib/prisma';

export const getTranslationsDbItem = async (skipIds: number[]) => {
    return await prisma.translations.findMany({
        take: 5,
        relationLoadStrategy: 'join',
        include: {
          words_translations_word_id_fromTowords: true,
          words_translations_word_id_toTowords: true,
        },
        ...(skipIds && {
            where: {  
                translation_id: {
                  not: {
                    in: skipIds,
                  }
                }
            }
        })
      })
}