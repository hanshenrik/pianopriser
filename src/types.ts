export type PianoTuner = {
  uuid: string;
  name: string;
  website?: string;
  phone?: string;
  services?: Array<string>;
  coordinates: [number, number];
};
