import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibRangeFormComponent } from './lib-range-form.component';

describe('LibRangeFormComponent', () => {
  let component: LibRangeFormComponent;
  let fixture: ComponentFixture<LibRangeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibRangeFormComponent]
    });
    fixture = TestBed.createComponent(LibRangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
