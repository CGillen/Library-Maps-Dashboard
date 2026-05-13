import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Bay } from 'models/bay';
import { LibRange } from 'models/lib-range';
import { BayService } from 'services/bay.service';
import { LibRangeService } from 'services/lib-range.service';

@Component({
  selector: 'app-bay-form',
  templateUrl: './bay-form.component.html',
  styleUrls: ['./bay-form.component.scss']
})
export class BayFormComponent implements OnInit, OnChanges {
  @Input() bay?: Bay;
  @Input() bays: Bay[] = [];
  @Output() bayChange = new EventEmitter<Bay>();
  @Output() baysChange = new EventEmitter<Bay[]>();
  title = 'Bay form';
  libRanges: LibRange[] = [];

  bayForm;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private libRangeService: LibRangeService,
    private bayService: BayService) {
    this.bayForm = this.formBuilder.group({
      id: [-1, [Validators.required]],
      name: ['', [Validators.required]],
      start_call_number: ['', []],
      end_call_number: ['', []],
      lib_range_id: [-1, [Validators.required]],
    });
  };

  ngOnInit(): void {
    this.libRangeService.getLibRanges()
      .subscribe(libRanges => {
        this.libRanges = libRanges;
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bay) {
      this.bayForm.patchValue(this.bay);
    } else {
      this.bayForm.reset();
    }
  }

  getBay(id: number): void {
    this.bayService.getBay(id)
      .subscribe(bay => {
        this.bay = bay;
        this.bayForm.patchValue(this.bay);
      });
  }

  save(): void {
    if (this.bay) {
      this.bayService.updateBay(this.bayForm.value as Bay)
        .subscribe(response => {
          this.bay = response as Bay;

          var index = this.bays.findIndex( b => b.id == response.id );
          this.bays[index] = this.bay;

          this.baysChange.emit(this.bays);
          this.bayChange.emit(this.bay);
        });
    }
  }

  add(name: string, start_call_number: string='', end_call_number: string='', lib_range_id: number): void {
    name = name.trim();
    start_call_number = start_call_number.trim();
    end_call_number = end_call_number.trim();

    this.bayService.addBay({ name, start_call_number, end_call_number, lib_range_id } as Bay)
      .subscribe(bay => {
        if (this.bays) {
          this.bays.push(bay);
          this.baysChange.emit(this.bays);
          this.bayChange.emit(bay);
        }
      });
  }

  get name() {
    return this.bayForm.get('name');
  }
  get start_call_number() {
    return this.bayForm.get('start_call_number');
  }
  get end_call_number() {
    return this.bayForm.get('end_call_number');
  }
  get lib_range_id() {
    return this.bayForm.get('lib_range_id');
  }

  onSubmit(): void {
    if (!this.name || !this.lib_range_id) { return; }

    if (this.bay) {
      this.save();
    } else {
      this.add(this.name.value, this.start_call_number?.value, this.end_call_number?.value, this.lib_range_id.value);
    }
  }
}
