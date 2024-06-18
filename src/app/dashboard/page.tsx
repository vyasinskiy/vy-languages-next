import { Playground } from '../components/Playground/Playground';
import prisma from '../lib/prisma';

export default async function DashboardPage() {
  // const languages = await prisma.languages.findMany();
  return <Playground />;
}