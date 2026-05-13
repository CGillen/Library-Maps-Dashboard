import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorLibRangeFormComponent } from './floor-lib-range-form.component';

describe('FloorLibRangeFormComponent', () => {
  let component: FloorLibRangeFormComponent;
  let fixture: ComponentFixture<FloorLibRangeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloorLibRangeFormComponent]
    });
    fixture = TestBed.createComponent(FloorLibRangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
