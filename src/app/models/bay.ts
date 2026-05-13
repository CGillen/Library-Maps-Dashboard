import { LibRange } from "./lib-range";

export interface Bay {
  id: number;
  name: string;
  start_call_number: string;
  end_call_number: string;
  lib_range_id: number;
  created_at: string;
  modified_at: string;
  url: string;
  lib_range: LibRange|null;
}