import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Floor } from 'models/floor';
import { Shelf } from 'models/shelf';
import { LibRange } from 'models/lib-range';
import { FloorService } from 'services/floor.service';
import { LibRangeService } from 'services/lib-range.service';
import { ShelfService } from 'services/shelf.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-leaflet-iframe',
  templateUrl: './leaflet-iframe.component.html',
  styleUrls: ['./leaflet-iframe.component.scss']
})
export class LeafletIframeComponent implements OnInit {
  map: L.Map|null = null;
  // Leaflet map options: https://leafletjs.com/reference.html#map
  options = {
    minZoom: -1,
    maxZoom: 3,
    center: L.latLng(0, 0),
    zoom: 0,
    crs: L.CRS.Simple,
  };
  // List of layers on map
  layers: L.Layer[] = [];
  floors: Floor[] = [];
  shelves: Shelf[] = [];

  // Drawn libranges
  drawnItems: L.FeatureGroup = L.featureGroup();
  libRanges: { [name: string]: LibRange[]|null } = {};
  highlightedLibRanges: number[] = [];
  // Floor layers
  baseLayers: { [name: string]: L.Layer } = Object();
  // Temporary storage for floor layer ordering. See #decodeFloorImages and #pushFloorImages
  decodePromises: Promise<void>[] = [];
  decodeImages = Object();

  constructor(
    private floorService: FloorService,
    private shelfService: ShelfService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {}

  // Grab the leaflet map object
  public onMapReady(map: L.Map) {
    this.map = map;
    this.layers.push(this.drawnItems);
    // Must wrap next & complete methods to ensure `this` object is scopped correctly
    this.floorService.getFloors()
    .subscribe({
      next: (floors) => {
        this.decodeFloorImages(floors)
      },
      complete: () => {
        this.pushFloorImages(map);
        this.route.queryParamMap.subscribe(params => this.search(params.get('cn'))); // output:
      }
    });

    // Update libRange drawings when layer changes
    this.map.on('baselayerchange', (e) => {
      this.redrawRanges(e.name);
    });
  }

  // Collect decoded floor images
  private decodeFloorImages(floors: Floor[]) {
    this.floors = floors.sort((a, b) => {
      if (a.name == b.name) return 0;
      return a.name < b.name ? -1 : 1;
    });
    this.floors.forEach((floor) => {
      // Get the libRanges for this floor
      this.floorService.getLibRanges(floor.id)
      .subscribe((libRanges) => {
        this.libRanges[floor.name] = libRanges;
      });

      // Image URL
      let imgUrl = floor.image_url;
      // Use a temp img element from outside the dom to gather height/width data
      let img = new Image();
      img.src = imgUrl;
      this.decodeImages[floor.name] = img;
      this.decodePromises.push(img.decode());
    });
  }
  // Wait for floor image collection to complete, then order by name
  // TODO: setup custom ordering on Floor objects
  private pushFloorImages(map: L.Map) {
    Promise.all(this.decodePromises).then(() => {
      Object.keys(this.decodeImages).forEach((floor_name: string) => {
        let img = this.decodeImages[floor_name];

        let width = img.width;
        let height = img.height;
        let bounds = L.latLngBounds([[0, 0], [height, width]]);
        // Recenter our view
        map.panTo(map.getCenter());
        map.fitBounds(bounds);
        map.setMinZoom(-5);
        // Setup the image layer
        let newLayer = L.imageOverlay(img.src, [[0, 0], [height, width]])
        if (!this.layers.length) this.layers.push(newLayer);
        this.baseLayers[floor_name] = newLayer;
      })
    });
  }

  // Clear lib ranges and redraw them
  private redrawRanges(floor_name: string): void {
    if (!this.libRanges[floor_name] == null) return;

    this.drawnItems.clearLayers();

    this.libRanges[floor_name]?.forEach((libRange: LibRange) => {
      let poly = L.polygon(libRange['polygon'] as L.LatLngExpression[]);

      if (this.highlightedLibRanges.includes(libRange.id || -1)) {
        poly.setStyle({
          color: 'purple',
          fillColor: 'yellow',
        });
        poly.bindPopup('Your item may be near here').openPopup();
      }

      this.drawnItems.addLayer(poly);
    });
  };

  // Get list of sheles that cn might be on and mark them for highlighting
  private search(cn: string|null): void {
    // Gets shelves which the cn is less than the ending and greather than the starting call numbers
    this.shelfService.searchShelves((cn || ''))
    .subscribe((shelves) => {
      // Matching shelves
      this.shelves = shelves;
      // IDs of ranges to highlight
      this.highlightedLibRanges = [];

      // Iterate found shelves and add the librange for those shelves to the highlighted libranges
      this.shelves.forEach((shelf: Shelf) => {
        var floor_name = shelf?.bay?.lib_range?.floor?.name;
        var lib_range_id = shelf?.bay?.lib_range?.id;

        // Floor names are the index into the list of libranges on said floor
        if (floor_name != undefined) {
          // Find the librange in our list of displayable libranges
          var lib_range = this.libRanges[floor_name]?.find((lr) => lr.id == lib_range_id);
          // And add it to the highlighted libranges if it exists
          if (lib_range) {
            this.highlightedLibRanges.push(lib_range.id || 0);
            this.redrawRanges(floor_name);
          }
        }
      });
    });
  }
}
