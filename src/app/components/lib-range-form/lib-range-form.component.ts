import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Floor } from 'models/floor';
import { LibRange } from 'models/lib-range';
import { FloorService } from 'services/floor.service';
import { LibRangeService } from 'services/lib-range.service';

@Component({
  selector: 'app-lib-range-form',
  templateUrl: './lib-range-form.component.html',
  styleUrls: ['./lib-range-form.component.scss']
})
export class LibRangeFormComponent implements OnInit, OnChanges {
  @Input() libRange: LibRange | null = null;
  @Input() libRanges: LibRange[] = [];
  @Output() libRangeChange = new EventEmitter<LibRange|null>();
  @Output() libRangesChange = new EventEmitter<LibRange[]>();
  title = 'Range Form';
  floors: Floor[] = [];

  libRangeForm;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private floorService: FloorService,
    private libRangeService: LibRangeService) {
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
    })
  }

  ngOnInit(): void {
    this.floorService.getFloors()
      .subscribe(floors => {
        this.floors = floors;
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.libRange) {
      this.alignArrayLength(this.libRange);
      this.libRangeForm.patchValue(this.libRange);
    } else {
      this.polygon.clear();
      this.libRangeForm.reset();
    }
  }

  alignArrayLength(libRange: LibRange): void {
    this.polygon.clear();
    while(this.polygon.length < libRange.polygon.length) this.polygon.push(this.defaultCoord());
  }

  getLibRange(id: number): void {
    this.libRangeService.getLibRange(id)
      .subscribe(libRange => {
        this.libRange = libRange;
        this.libRangeForm.patchValue(this.libRange);
      });
  }

  save(): void {
    if (this.libRange) {
      this.libRangeService.updateLibRange(this.libRangeForm.value as LibRange)
        .subscribe(response => {
          this.libRange = response as LibRange;

          var index = this.libRanges.findIndex( b => b.id == response.id );
          this.libRanges[index] = this.libRange;

          this.libRangesChange.emit(this.libRanges);
          this.libRangeChange.emit(this.libRange);
        });
    }
  }

  add(name: string, polygon: {lat:number,lng:number}[], floor_id: number): void {
    name = name.trim();

    this.libRangeService.addLibRange({ name, polygon, floor_id } as LibRange)
      .subscribe(libRange => {
        this.libRanges.push(libRange);
        this.libRangesChange.emit(this.libRanges);
        this.libRangeChange.emit(this.libRange);
      });
  }

  defaultCoord(): FormGroup {
    return this.formBuilder.group({
      lat: [-1, [Validators.required]],
      lng: [-1, [Validators.required]],
    });
  }

  addCoord() {
    this.polygon.push(this.defaultCoord());
  }
  deleteCoord(index: number) {
    this.polygon.removeAt(index);
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

  onSubmit(): void {
    if (!this.name || !this.polygon || !this.floor_id) { return; }

    if (this.libRange) {
      this.save();
    } else {
      // this.add(this.name.value, this.polygon.value, this.floor_id.value);
    }
  }
}
