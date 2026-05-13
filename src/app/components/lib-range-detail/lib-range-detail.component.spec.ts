import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibRangeDetailComponent } from './lib-range-detail.component';

describe('LibRangeDetailComponent', () => {
  let component: LibRangeDetailComponent;
  let fixture: ComponentFixture<LibRangeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibRangeDetailComponent]
    });
    fixture = TestBed.createComponent(LibRangeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
