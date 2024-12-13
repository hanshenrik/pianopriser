'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';

// ...

export default function ProfileForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [full_name, setFullName] = useState<string | null>(null);
  const [display_name, setDisplayName] = useState<string | null>(null);
  const [image_url, setImageUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profile')
        .select(`full_name, display_name, image_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullName(data.full_name);
        setDisplayName(data.display_name);
        setImageUrl(data.image_url);
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
  }: {
    display_name: string | null;
    full_name: string | null;
  }) {
    try {
      setLoading(true);

      console.log({
        id: user?.id as string,
        full_name,
        display_name,
        updated_at: new Date().toISOString(),
      });
      const { error } = await supabase.from('profile').upsert({
        id: user?.id as string,
        full_name,
        display_name,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating the data!', { error });
    } finally {
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
          })
        }
      >
        <div>
          <label htmlFor="image_url">Profile image</label>
          <input
            id="image_url"
            type="file"
            accept="image/png, image/jpeg"
            value={image_url || ''}
            onChange={async (e) => {
              // TODO: Upload to supabase storage
              // const avatarFile = e.target.files[0];
              // const { data, error } = await supabase.storage
              //   .from('images')
              //   .upload(`profiles/${user.id}`, avatarFile, {
              //     cacheControl: '3600',
              //     upsert: true,
              //   });

              // Update the image_url shown here
              setImageUrl(e.target.value);
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

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="button">
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
