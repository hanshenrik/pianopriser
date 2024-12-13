import Hero from '@/components/hero';
import { createClient } from '@/utils/supabase/server';

export default async function Index() {
  const supabase = await createClient();
  const { data: pianoTuners } = await supabase.from('piano_tuner').select();

  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <pre>{JSON.stringify(pianoTuners, null, 2)}</pre>
      </main>
    </>
  );
}
