import { Playground } from '../components/Playground/Playground';
import { DEV_LANG_FROM, DEV_LANG_TO, DEV_USER_ID } from '@lib/constants';
import prisma from '@lib/prisma';
import { getTranslationsDbItems } from '../lib/queries/playground';
import { mapTranslationDbItemToPlaygroundItem } from '../lib/tools/playground';

export default async function DashboardPage() {
  const translations = await getTranslationsDbItems([]);
  const playgroundItems = translations.map(t => mapTranslationDbItemToPlaygroundItem(t));

  return <Playground items={playgroundItems} langFrom={DEV_LANG_FROM} langTo={DEV_LANG_TO} />;
}