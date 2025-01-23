import Hero from '@/components/hero';
import { PianoTunerCard } from '@/components/ui/piano-tuner-card';
import { PianoTunerWithProfile } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';

export default async function Index() {
  const supabase = await createClient();
  const pianoTunersWithProfileQuery = supabase.from('piano_tuner').select(`
    *,
    profile:profile_id(
      display_name,
      full_name,
      image_url
    )
  `);

  const { data, error } = await pianoTunersWithProfileQuery;
  if (error) {
    throw error;
  }
  const pianoTunersWithProfile: PianoTunerWithProfile[] = data;

  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pianoTunersWithProfile?.map((tuner) => (
            <PianoTunerCard key={tuner.id} tuner={tuner} />
          ))}
        </div>
      </main>
    </>
  );
}
