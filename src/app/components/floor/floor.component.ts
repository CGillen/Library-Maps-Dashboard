import { Component, OnDestroy, OnInit } from '@angular/core';
import { Floor } from 'models/floor';
import { LibRange } from 'models/lib-range';
import { Subscription } from 'rxjs';
import { FloorLeafletDataServiceService } from 'services/floor-leaflet-data-service.service';
import { FloorService } from 'services/floor.service';
import { LibRangeService } from 'services/lib-range.service';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit, OnDestroy {
  floors: Floor[] = [];
  floor: Floor | null = null;
  libRanges: LibRange[] = [];
  curLibRanges: LibRange[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private floorService: FloorService,
    private libRangeService: LibRangeService,
    private leafletMapService: FloorLeafletDataServiceService) { }

  ngOnInit(): void {
    this.getFloors();
    this.getLibRanges();

    let sub = this.leafletMapService.finishedLibRange.subscribe((libRange) => {
      if (!libRange) return;
      let existingIndex = this.libRanges.findIndex((l => {
        return l.id == libRange.id
      }))
      if (existingIndex >= 0) {
        this.libRanges[existingIndex] = libRange;
      } else {
        this.libRanges.push(libRange);
      }
      this.updateCurLibRanges();
    });
    this.subscriptions.push(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  getFloors(): void {
    this.floorService.getFloors()
      .subscribe(floors => {
        this.floors = floors
        this.floor = floors[0];
        this.updateCurLibRanges();
      });
  }

  getLibRanges(): void {
    this.libRangeService.getLibRanges()
      .subscribe(libRanges => {
        this.libRanges = libRanges
        this.updateCurLibRanges();
      });
  }

  updateFloor(floor: Floor) {
    this.floor = floor;
    if (!this.floor) return;

    this.updateCurLibRanges();
  }
  updateCurLibRanges(): void {
    this.curLibRanges = this.libRanges.filter(l => {
      if (!this.floor) return false;
      return l.floor_id == this.floor.id
    });
  };
}
