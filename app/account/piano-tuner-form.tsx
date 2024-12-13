'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';

// ...

export default function PianoTunerForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [pianoTunerId, setPianoTunerId] = useState<string | null>(null);
  const [business_name, setBusinessName] = useState<string | null>(null);
  const [website_url, setWebsiteUrl] = useState<string | null>(null);
  const [business_email, setBusinessEmail] = useState<string | null>(null);
  const [business_phone, setBusinessPhone] = useState<string | null>(null);
  const [business_image_url, setBusinessImageUrl] = useState<string | null>(
    null
  );
  const [education, setEducation] = useState<string | null>(null);
  const [is_active, setIsActive] = useState<boolean | null>(null);

  const getPianoTuner = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('piano_tuner')
        .select(
          `id, business_name, business_email, business_phone, business_image_url, website_url, education, is_active, profile_id`
        )
        .eq('profile_id', user?.id)
        .single();

      console.log({ profile_id: data?.profile_id, id: user?.id });

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setPianoTunerId(data.id);

        setBusinessName(data.business_name);
        setBusinessEmail(data.business_email);
        setBusinessPhone(data.business_phone);
        setBusinessImageUrl(data.business_image_url);
        setWebsiteUrl(data.website_url);
        setEducation(data.education);
        setIsActive(data.is_active);
      }
    } catch (error) {
      setPianoTunerId(null);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      getPianoTuner();
    }
  }, [user, getPianoTuner]);

  async function updatePianoTuner({
    id,
    business_name,
    business_email,
    business_phone,
    business_image_url,
    website_url,
    education,
    is_active,
  }: {
    id: string;
    business_name: string | null;
    business_email: string | null;
    business_phone: string | null;
    business_image_url: string | null;
    website_url: string | null;
    education: string | null;
    is_active: boolean | null;
  }) {
    try {
      setLoading(true);

      console.log({
        id: user?.id as string,
        business_name,
        business_email,
        business_phone,
        business_image_url,
        website_url,
        education,
        is_active,
        updated_at: new Date().toISOString(),
      });
      const { error } = await supabase.from('piano_tuner').upsert({
        id,
        business_name,
        business_email,
        business_phone,
        business_image_url,
        website_url,
        education,
        is_active,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Piano tuner updated!');
    } catch (error) {
      console.error('Error updating the data!', { error });
    } finally {
      setLoading(false);
    }
  }

  if (!pianoTunerId) {
    return null;
  } else {
    return (
      <form
        className="form-widget"
        onSubmit={(data) => {
          console.log({ data });
          updatePianoTuner({
            id: pianoTunerId as string,
            business_name,
            business_email,
            business_phone,
            business_image_url,
            website_url,
            education,
            is_active,
          });
        }}
      >
        <div>
          <label htmlFor="business_image_url">Logo</label>
          <input
            id="business_image_url"
            type="file"
            accept="image/png, image/jpeg"
            value={business_image_url || ''}
            onChange={async (e) => {
              // TODO: Upload to supabase storage
              // const avatarFile = e.target.files[0];
              // const { data, error } = await supabase.storage
              //   .from('images')
              //   .upload(`logos/${pianoTunerId}`, avatarFile, {
              //     cacheControl: '3600',
              //     upsert: true,
              //   });

              // Update the image_url shown here
              setBusinessImageUrl(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="business_name">Business name</label>
          <input
            id="business_name"
            type="text"
            value={business_name || ''}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="business_email">Business email</label>
          <input
            id="business_email"
            type="email"
            inputMode="email"
            value={business_email || ''}
            onChange={(e) => setBusinessEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="business_phone">Business phone</label>
          <input
            id="business_phone"
            type="tel"
            inputMode="tel"
            value={business_phone || ''}
            onChange={(e) => setBusinessEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="website_url">Website</label>
          <input
            id="website_url"
            type="url"
            inputMode="url"
            value={website_url || ''}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="education">Education</label>
          <input
            id="education"
            type="text"
            value={education || ''}
            onChange={(e) => setEducation(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="is_active">Active</label>
          <input
            id="is_active"
            type="checkbox"
            checked={!!is_active}
            onChange={(e) => setIsActive(e.target.checked)}
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
    );
  }
}
