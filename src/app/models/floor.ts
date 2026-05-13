import { LibRange } from "./lib-range";

export interface Floor {
  id: number;
  name: string;
  order: number;
  height: number;
  width: number;
  image_url: string;
  image: string;
  lib_ranges: LibRange[]|null;
}
