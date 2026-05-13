import { Floor } from "./floor";

export interface LibRange {
  id?: number;
  name: string;
  polygon: {lat: number, lng: number}[];
  floor_id: number;
  created_at?: string;
  modified_at?: string;
  url?: string;
  floor: Floor|null;
}