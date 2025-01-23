import ProfileForm from './profile-form';
import PianoTunerForm from './piano-tuner-form';
import { createClient } from '@/utils/supabase/server';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <ProfileForm user={user} />
    </>
  );
}
