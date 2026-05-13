import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Floor } from 'models/floor';

import { LibRange } from 'models/lib-range';
import { FloorService } from 'services/floor.service';
import { LibRangeService } from 'services/lib-range.service';
import { MessageService } from 'services/message.service';

@Component({
  selector: 'app-lib-range',
  templateUrl: './lib-range.component.html',
  styleUrls: ['./lib-range.component.scss']
})
export class LibRangeComponent implements OnInit, OnChanges {
  floors: Floor[] = [];
  floor: Floor | null = null;
  libRanges: LibRange[] = [];
  libRange: LibRange | null = null;

  constructor(
    private libRangeService: LibRangeService,
    private floorService: FloorService,
    private messageService: MessageService) { }

  getLibRanges(): void {
    this.libRangeService.getLibRanges()
      .subscribe(libRanges => {
        this.libRanges = libRanges;
        this.libRange = libRanges[0];
      })
  }

  getFloors(): void {
    this.floorService.getFloors()
      .subscribe(floors => {
        this.floors = floors
        this.floor = floors[0];
      });
  }

  ngOnInit(): void {
    this.getLibRanges();
    this.getFloors();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.libRange) {
      this.floor = this.floors[this.libRange.floor_id];
    } else {
      this.floor = this.floors[0];
    }
  }
}
