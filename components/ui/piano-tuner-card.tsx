import { PianoTunerWithProfile } from '@/lib/types';
import Image from 'next/image';

export const PianoTunerCard = ({ tuner }: { tuner: PianoTunerWithProfile }) => (
  <div className="p-6 rounded-lg border bg-card text-card-foreground">
    <div className="flex items-center gap-4 mb-4">
      {tuner.profile?.image_url && (
        <Image
          src={tuner.profile.image_url}
          alt={tuner.profile.display_name || ''}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
      )}
      <div>
        <h3 className="font-semibold">
          {tuner.profile?.display_name || tuner.business_name}
        </h3>
        {tuner.profile?.full_name && (
          <p className="text-sm text-muted-foreground">
            {tuner.profile.full_name}
          </p>
        )}
      </div>
    </div>

    <div className="space-y-2">
      {tuner.business_name && (
        <p className="text-sm">
          <span className="font-medium">Business:</span> {tuner.business_name}
        </p>
      )}{' '}
      {tuner.business_email && (
        <p className="text-sm">
          <span className="font-medium">Email:</span> {tuner.business_email}
        </p>
      )}{' '}
      {tuner.business_phone && (
        <p className="text-sm">
          <span className="font-medium">Phone:</span> {tuner.business_phone}
        </p>
      )}{' '}
      {tuner.education && (
        <p className="text-sm">
          <span className="font-medium">Education:</span> {tuner.education}
        </p>
      )}
    </div>
  </div>
);
