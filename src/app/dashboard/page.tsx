import { Playground } from '../components/Playground/Playground';
import { DEV_LANG_FROM, DEV_LANG_TO, DEV_USER_ID } from '@lib/constants';
import prisma from '@lib/prisma';
import { getTranslationsDbItem } from '../lib/queries/playground';
import { mapTranslationDbItemToPlaygroundItem } from '../lib/tools/playground';

export default async function DashboardPage() {
  const progress = await prisma.progress.findMany({
    relationLoadStrategy: 'join',
    include: {
      users: true,
    },
    where: {
      user_id: DEV_USER_ID,
    }
  });
  const translations = await getTranslationsDbItem(progress.map(p => p.progress_id));
  const playgroundItems = translations.map(t => mapTranslationDbItemToPlaygroundItem(t));

  return <Playground items={playgroundItems} langFrom={DEV_LANG_FROM} langTo={DEV_LANG_TO} />;
}