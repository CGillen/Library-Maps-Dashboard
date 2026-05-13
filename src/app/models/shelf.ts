import { Bay } from "./bay";

export interface Shelf {
  id: number;
  name: string;
  start_call_number: string;
  end_call_number: string;
  norm_start_call_number: string;
  norm_end_call_number: string;
  bay_id: number;
  bay: Bay|null;
}