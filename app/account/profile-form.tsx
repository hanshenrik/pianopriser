'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Image from 'next/image';
import { Profile } from '@/lib/types';

const supabase = createClient();

export default function ProfileForm({ user }: { user: User | null }) {
  const [loading, setLoading] = useState(true);
  const [full_name, setFullName] = useState<string | null>(null);
  const [display_name, setDisplayName] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullName(data.full_name);
        setDisplayName(data.display_name);
        setProfile(data);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user, getProfile]);

  async function updateProfile({
    display_name,
    full_name,
    image_url,
  }: {
    display_name: string | null;
    full_name: string | null;
    image_url: string | null;
  }) {
    try {
      setLoading(true);

      console.log({
        id: user?.id as string,
        profile_id: profile?.id,
        full_name,
        display_name,
        image_url,
        updated_at: new Date().toISOString(),
      });
      const { error } = await supabase.from('profile').upsert({
        id: user?.id as string,
        full_name,
        display_name,
        image_url,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating the data!', { error });
    } finally {
      getProfile();
      setLoading(false);
    }
  }

  return !user ? (
    <div>Du er ikke logget inn</div>
  ) : (
    <>
      <form
        className="form-widget"
        onSubmit={() =>
          updateProfile({
            full_name,
            display_name,
            image_url: profile?.image_url || null,
          })
        }
      >
        <div>
          <Image
            src={profile?.image_url || '/images/default-avatar.png'}
            alt="Profile image"
            width={100}
            height={100}
          />
          <label htmlFor="image_url">Profile image</label>
          <input
            id="image_url"
            type="file"
            multiple={false}
            accept="image/png, image/jpeg"
            onChange={async (e) => {
              if (!e.target.files?.[0]) {
                console.error('No file selected');
                return;
              }

              try {
                const avatarFile = e.target.files[0];
                const fileName = `${user?.id}.${avatarFile.type.split('/')[1]}`;
                console.log({ fileName });
                const { data, error } = await supabase.storage
                  .from('images')
                  .upload(`profiles/${fileName}`, avatarFile, {
                    cacheControl: '3600',
                    upsert: true,
                    metadata: {
                      profile_id: profile?.id,
                    },
                  });

                console.log('Successful upload!', { data, error });

                const { data: imageData } = supabase.storage
                  .from('images')
                  .getPublicUrl(`profiles/${fileName}`);

                console.log({ imageData });

                // if (imageData.publicUrl) {
                //   updateProfile({
                //     full_name,
                //     display_name,
                //     image_url: imageData.publicUrl,
                //   });
                // }
              } catch (error) {
                console.error('Error uploading image', { error });
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={user?.email} disabled />
        </div>
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input
            id="full_name"
            type="text"
            value={full_name || ''}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="display_name">Display name</label>
          <input
            id="display_name"
            type="text"
            value={display_name || ''}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div>
          <button
            className="button primary block"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading …' : 'Update'}
          </button>
        </div>
      </form>
    </>
  );
}
