import { createClient } from '@/utils/supabase/server';

export default async function PianoTuners() {
  const supabase = await createClient();
  const { data: pianoTuners } = await supabase.from('piano_tuner').select();

  return <pre>{JSON.stringify(pianoTuners, null, 2)}</pre>;
}
