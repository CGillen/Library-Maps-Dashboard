import { Injectable } from '@angular/core';
import { LibRange } from 'models/lib-range';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloorLeafletDataServiceService {

  constructor() { }

  private curLibRangeDataSource: BehaviorSubject<{name?: string, id?: number, floor_id?: number, polygon?: {lat:number,lng:number}[]|undefined}|null> = new BehaviorSubject<{name?: string, id?: number, floor_id?: number, poly?: {lat:number,lng:number}[]|undefined}|null>(null);
  public curLibRangeData = this.curLibRangeDataSource.asObservable();
  private finishedLibRangeDataSource: BehaviorSubject<LibRange|null> = new BehaviorSubject<LibRange|null>(null);
  public finishedLibRange = this.finishedLibRangeDataSource

  public updateCurLibRangeData(libRangeData: {name?: string, id?: number, floor_id?: number, polygon?: {lat:number,lng:number}[]|undefined}|null) {
    this.curLibRangeDataSource.next(libRangeData);
  }
  public finishLibRange(libRange: LibRange|null) {
    this.finishedLibRangeDataSource.next(libRange);
  }
}
