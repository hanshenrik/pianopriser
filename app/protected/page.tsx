import { ProfileCard } from '@/components/ui/profile-card';
import { Profile } from '@/lib/types';
import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileQuery = supabase
    .from('profile')
    .select('*')
    .eq('id', user?.id);
  const { data, error } = await profileQuery;
  if (error) {
    throw error;
  }
  const profile: Profile = data[0];

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <ProfileCard profile={profile} />
      </div>
    </div>
  );
}
