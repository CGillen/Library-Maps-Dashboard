import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Bay } from 'models/bay';
import { Shelf } from 'models/shelf';
import { BayService } from 'services/bay.service';
import { ShelfService } from 'services/shelf.service';

@Component({
  selector: 'app-shelf-form',
  templateUrl: './shelf-form.component.html',
  styleUrls: ['./shelf-form.component.scss']
})
export class ShelfFormComponent implements OnInit, OnChanges {
  @Input() shelf?: Shelf;
  @Input() shelves: Shelf[] = [];
  @Output() shelfChange = new EventEmitter<Shelf>();
  @Output() shelvesChange = new EventEmitter<Shelf[]>();
  title = 'Shelf form';
  bays: Bay[] = [];

  shelfForm;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private bayService: BayService,
    private shelfService: ShelfService) {
    this.shelfForm = this.formBuilder.group({
      id: [-1, [Validators.required]],
      name: ['', [Validators.required]],
      start_call_number: ['', []],
      end_call_number: ['', []],
      bay_id: [-1, [Validators.required]],
    });
  };

  ngOnInit(): void {
    this.bayService.getBays()
      .subscribe(bays => {
        this.bays = bays;
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.shelf) {
      this.shelfForm.patchValue(this.shelf);
    } else {
      this.shelfForm.reset();
    }
  }

  getShelf(id: number): void {
    this.shelfService.getShelf(id)
      .subscribe(shelf => {
        this.shelf = shelf;
        this.shelfForm.patchValue(this.shelf);
      });
  }

  save(): void {
    if (this.shelf) {
      this.shelfService.updateShelf(this.shelfForm.value as Shelf)
        .subscribe(response => {
          this.shelf = response as Shelf;

          var index = this.shelves.findIndex( b => b.id == response.id );
          this.shelves[index] = this.shelf;

          this.shelvesChange.emit(this.shelves);
          this.shelfChange.emit(this.shelf);
        });
    }
  }

  add(name: string, start_call_number: string='', end_call_number: string='', bay_id: number): void {
    name = name.trim();
    start_call_number = start_call_number.trim();
    end_call_number = end_call_number.trim();

    this.shelfService.addShelf({ name, start_call_number, end_call_number, bay_id } as Shelf)
      .subscribe(shelf => {
        if (this.shelves) {
          this.shelves.push(shelf);
          this.shelvesChange.emit(this.shelves);
          this.shelfChange.emit(shelf);
        }
      });
  }

  get name() {
    return this.shelfForm.get('name');
  }
  get start_call_number() {
    return this.shelfForm.get('start_call_number');
  }
  get end_call_number() {
    return this.shelfForm.get('end_call_number');
  }
  get bay_id() {
    return this.shelfForm.get('bay_id');
  }

  onSubmit(): void {
    if (!this.name || !this.bay_id) { return; }

    if (this.shelf) {
      this.save();
    } else {
      this.add(this.name.value, this.start_call_number?.value, this.end_call_number?.value, this.bay_id.value);
    }
  }
}
