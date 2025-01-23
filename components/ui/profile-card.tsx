import { Profile } from '@/lib/types';
import Image from 'next/image';

export const ProfileCard = ({ profile }: { profile: Profile }) => (
  <div className="p-6 rounded-lg border bg-card text-card-foreground">
    <div className="flex items-center gap-4 mb-4">
      {profile?.image_url && (
        <Image
          src={profile.image_url}
          alt={profile.display_name || ''}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="font-semibold">{profile?.display_name}</h3>
        {profile?.full_name && (
          <p className="text-sm text-muted-foreground">{profile.full_name}</p>
        )}
      </div>
    </div>
  </div>
);
