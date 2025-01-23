export type Profile = {
  id: string;
  display_name?: string;
  full_name?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
};

export type PianoTunerWithProfile = PianoTuner & { profile: Profile };

export type PianoTuner = {
  id: string;
  business_name?: string;
  business_email?: string;
  business_phone?: string;
  business_image_url?: string;
  website_url?: string;
  education?: string;
  is_verified?: boolean;
  is_certified?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
};
