import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { LibRange } from 'models/lib-range';
import "@geoman-io/leaflet-geoman-free";
import { Floor } from 'models/floor';
import { FloorLeafletDataServiceService } from 'services/floor-leaflet-data-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit, OnChanges {
  map: any;
  @Input() floor: Floor | null = null;
  @Input() libRanges: LibRange[] = [];
  curLibRange: LibRange | null = null;
  curPoly: L.Polygon | null = null;
  subscriptions: Subscription[] = [];
  drawnItems: L.FeatureGroup = L.featureGroup();
  // coords: Array<Array<number>> = [];
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

  constructor(
    private leafletMapService: FloorLeafletDataServiceService
  ) { }

  ngOnInit(): void {
    let sub = this.leafletMapService.curLibRangeData.subscribe((data) => {
      if (data && this.curPoly) {
        this.curPoly.pm.disable();
        this.curPoly.setLatLngs(data.polygon as L.LatLng[]);
        this.curPoly.pm.enable();
      }
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  // Grab the leaflet map object
  public onMapReady(map: L.Map) {
    this.map = map;
    this.map.pm.addControls({
      position: 'topright',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawText: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
      rotateMode: false,
      drawMarker: false,
    });
    // When the user clicks a geoman draw tool
    this.map.on("pm:drawstart", (e: any) => {
      this.resetPolyState();
      this.curPoly = null;
      this.curLibRange = null;
      this.leafletMapService.updateCurLibRangeData(null);
    });
    // When the user finishes a geoman drawing
    this.map.on("pm:create", (e: any) => {
      this.resetPolyState();
      e.layer.pm.enableLayerDrag();
      e.layer.pm.enable();

      this.curPoly = e.layer;
      this.curLibRange = null;

      let curLibRangeData = {
        id: -1,
        name: '',
        polygon: this.polyData(),
      };
      this.leafletMapService.updateCurLibRangeData(curLibRangeData);

      this.addMoveEvent(this.curPoly);
    });
    this.redrawMap();
  }

  // When the floor changes:
  //  Redraw floor image
  //  Clear the drawn polygons
  //  Draw new lib ranges
  public ngOnChanges(changes: SimpleChanges): void {
    // We're updating the map, it needs to exist
    if (!this.map) return;

    // It's safe to redraw the map if we're not updating the libRange form
    //  || we're resetting the form
    if (!changes['curPoly'] || !changes['curPoly']['currentValue']) {
      this.redrawMap();
    }
  }

  // Draw floor image and all lib ranges
  private redrawMap() {
    // Need a floor and image to display
    if (!this.floor || !this.floor.image_url) return;

    // Image URL
    let imgUrl = this.floor.image_url;
    // Use a temp img element from outside the dom to gather height/width data
    let img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      let bounds = L.latLngBounds([[0, 0], [height, width]]);

      // Recenter our view
      this.map.panTo(this.map.getCenter());
      this.map.fitBounds(bounds);
      this.map.setMinZoom(-5);
      // Setup the image layer
      let newLayer = L.imageOverlay(imgUrl, [[0, 0], [height, width]])

      this.reloadLayers(newLayer);
    };
  }

  // Clear lib ranges and redraw them
  private redrawRanges(): void {
    if (!this.libRanges) return;

    this.drawnItems.clearLayers();

    this.libRanges.forEach((libRange: LibRange) => {
      if (!libRange['polygon']) return;

      let poly = L.polygon(libRange['polygon']);
      this.resetPolyStyle(poly);
      this.assignEditModeEvents(poly, libRange);
      this.addMoveEvent(poly);
      this.drawnItems.addLayer(poly);
    });

  };

  /*
  * Setup methods for draw events
  */
  private resetPolyStyle(poly: L.Polygon|null) {
    if (poly) poly.setStyle({
      color: 'purple',
      fillColor: 'yellow',
    });
  }
  private resetPolyState() {
    this.resetPolyStyle(this.curPoly);
    if (this.curPoly && !this.curLibRange) this.curPoly.remove();
    if (this.curPoly) {
      this.curPoly.pm.disable();
    }
  }
  private addMoveEvent(poly: L.Polygon|null) {
    if (!poly) return;
    // When the user moves the current geoman drawing
    poly.on("pm:dragend", (e: any) => {
      this.curPoly = null;
      e.layer.pm.enableLayerDrag();
      e.layer.pm.enable();
      this.updateForm(e.layer);
    });
    // When the user resizes the current geoman drawing
    poly.on("pm:edit", (e: any) => {
      this.updateForm(e.layer);
    });
    // When the user leaves edit mode & a change is not save
    poly.on("pm:disable", (e: any) => {
      // Reset to last known position
      if (this.curLibRange) {
        this.curPoly?.setLatLngs([
          this.curLibRange.polygon,
        ]);
      }
      if (this.curPoly) this.curPoly.pm.disableLayerDrag();
    });
  }
  private updateForm(poly: L.Polygon) {
    this.curPoly = poly;

    let curLibRangeData = {
      polygon: this.polyData(),
    };
    this.leafletMapService.updateCurLibRangeData(curLibRangeData);
  }

  private polyData(polygon?: L.Polygon): {lat: number, lng: number}[] {
    let polyData:{lat:number,lng:number}[] = [];
    let poly = polygon ? polygon : this.curPoly;
    if (poly && poly.toGeoJSON().geometry.type == 'Polygon') {
      let latlngs = poly.getLatLngs()[0] as L.LatLng[]
      polyData = latlngs.map(latlng => {
        return {lat: Math.round(latlng.lat), lng: Math.round(latlng.lng)};
      });
    }
    return polyData;
  }

  private assignEditModeEvents(poly: L.Polygon, libRange: LibRange) {
    poly.on("click", (e) => {
      if (e.target == this.curPoly) return;

      this.resetPolyState();
      this.curLibRange = libRange;
      this.curPoly = poly;
      let curLibRangeData = {
        id: this.curLibRange.id,
        name: this.curLibRange.name,
        polygon: this.polyData(e.target),
      };
      this.leafletMapService.updateCurLibRangeData(curLibRangeData);

      this.curPoly.setStyle({
        color: 'blue',
        fillColor: 'lightBlue',
      });

      this.curPoly.pm.enableLayerDrag();
      this.curPoly.pm.enable();
    });
  }

  // Remove all layers & init with given layer
  private reloadLayers(l?: L.Layer) {
    this.map.pm.getGeomanLayers().forEach((layer: L.PM.PMLayer) => {
      layer.remove();
    });
    this.layers = [this.drawnItems];
    if (l) this.layers.push(l);
    this.curPoly = null;
    this.leafletMapService.updateCurLibRangeData({ id: -1, name: '', polygon: this.polyData() });

    // Lib ranges may have changed, redraw them
    this.redrawRanges();
  }
}
