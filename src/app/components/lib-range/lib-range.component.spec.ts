import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibRangeComponent } from './lib-range.component';

describe('LibRangeComponent', () => {
  let component: LibRangeComponent;
  let fixture: ComponentFixture<LibRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibRangeComponent]
    });
    fixture = TestBed.createComponent(LibRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
