import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Floor } from 'models/floor';
import { Subscription } from 'rxjs';
import { FloorLeafletDataServiceService } from 'services/floor-leaflet-data-service.service';
import { LibRangeService } from 'services/lib-range.service';
import { environment } from '../../../environments/environment';
import { LibRange } from 'models/lib-range';

@Component({
  selector: 'app-floor-lib-range-form',
  templateUrl: './floor-lib-range-form.component.html',
  styleUrls: ['./floor-lib-range-form.component.scss'],
})
export class FloorLibRangeFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() floor: Floor | null = null;
  subscriptions: Subscription[] = [];

  environment = environment;
  libRangeForm: FormGroup;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private libRangeService: LibRangeService,
    private leafletMapService: FloorLeafletDataServiceService,
    private cdr: ChangeDetectorRef) {
      this.libRangeForm = this.formBuilder.group({
        id: [-1, [Validators.required]],
        name: ['', [Validators.required]],
        polygon: this.formBuilder.array([
          this.formBuilder.group({
            lat: [-1, [Validators.required]],
            lng: [-1, [Validators.required]],
          })
        ]),
        floor_id: [-1, [Validators.required]],
      });
    }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.floor) {
      this.libRangeForm.patchValue({
        name: '',
        floor_id: this.floor.id,
        polygon: [],
      });
      this.alignPolygonArrayLength(1);
    }
  }

  ngOnInit(): void {
    this.libRangeForm.valueChanges.subscribe(selectedValue => {
      console.log(selectedValue);
      this.leafletMapService.updateCurLibRangeData(selectedValue);
    });
    let sub = this.leafletMapService.curLibRangeData.subscribe((data) => {
      if (data == this.libRangeForm.value as LibRange) return;

      console.log(data);
      if (data) {
        if (data.polygon) this.alignPolygonArrayLength(data.polygon.length);
        this.libRangeForm.patchValue(data);
      } else {
        this.alignPolygonArrayLength(1);
        this.libRangeForm.reset();
        this.libRangeForm.patchValue({floor_id: this.floor?.id})
      }

      this.cdr.detectChanges();
    });
    this.subscriptions.push(sub);
  };

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  onSubmit() {
    console.log(this.id)
    if (this.id && this.id.value > 0) {
      this.libRangeService.updateLibRange(this.libRangeForm.value as LibRange)
      .subscribe(libRange => {
        this.leafletMapService.finishLibRange(libRange)
      });
    } else {
      this.libRangeService.addLibRange(this.libRangeForm.value as LibRange)
      .subscribe(libRange => {
        this.leafletMapService.finishLibRange(libRange)
      });
    }
  }


  defaultCoord(): FormGroup {
    return this.formBuilder.group({
      lat: [-1, [Validators.required]],
      lng: [-1, [Validators.required]],
    });
  }
  alignPolygonArrayLength(length: number): void {
    this.polygon.clear();
    while(this.polygon.length < length) this.addCoord();
  }
  addCoord() {
    this.polygon.push(this.defaultCoord());
  }
  deleteCoord(index: number) {
    this.polygon.removeAt(index);
  }

  get id() {
    return this.libRangeForm.get('id');
  }
  get name() {
    return this.libRangeForm.get('name');
  }
  get polygon() {
    return this.libRangeForm.get('polygon') as FormArray;
  }
  get floor_id() {
    return this.libRangeForm.get('floor_id');
  }
}
