import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Floor } from 'models/floor';
import { FloorService } from 'services/floor.service';

@Component({
  selector: 'app-floor-form',
  templateUrl: './floor-form.component.html',
  styleUrls: ['./floor-form.component.scss']
})
export class FloorFormComponent implements OnInit, OnChanges {
  @Input() floor: Floor | null = null;
  @Input() floors: Floor[] = [];
  @Output() floorChange = new EventEmitter<Floor>();
  @Output() floorsChange = new EventEmitter<Floor[]>();
  title = 'Floor form';

  floorForm;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private floorService: FloorService) {
    this.floorForm = this.formBuilder.group({
      id: [-1, [Validators.required]],
      name: ['', [Validators.required]],
      image: ['', []],
    });
  };

  ngOnInit(): void {
    this.floorService.getFloors()
      .subscribe(floors => {
        this.floors = floors;
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.floor) {
      this.floor.image = '';
      this.floorForm.patchValue(this.floor);
    } else {
      this.floorForm.reset();
    }
  }

  getFloor(id: number): void {
    this.floorService.getFloor(id)
      .subscribe(floor => {
        this.floor = floor;
        this.floorForm.patchValue(this.floor);
      });
  }

  save(): void {
    if (this.floor) {
      // let floor = this.floorForm.value;
      // floor.image = this.uploaded_image;

      this.floorService.updateFloor(this.floorForm.value as Floor)
        .subscribe(response => {
          this.floor = response as Floor;

          var index = this.floors.findIndex(b => b.id == response.id);
          this.floors[index] = this.floor;

          this.floorsChange.emit(this.floors);
          this.floorChange.emit(this.floor);
        });
    }
  }

  add(name: string): void {
    name = name.trim();

    this.floorService.addFloor(this.floorForm.value as Floor)
      .subscribe(floor => {
        if (this.floors) {
          this.floors.push(floor);
          this.floorsChange.emit(this.floors);
          this.floorChange.emit(floor);
        }
      });
  }

  get name() {
    return this.floorForm.get('name');
  }

  uploadImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    // let me = this;
    let file = target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      //me.modelvalue = reader.result;
      this.floorForm.patchValue({ image: reader.result as string });
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  onSubmit(): void {
    if (this.floor) {
      this.save();
    } else {
      if (!this.name) { return; }
      this.add(this.name.value);
    }
  }
}
