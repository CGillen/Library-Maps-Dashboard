import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibRangeSearchComponent } from './lib-range-search.component';

describe('LibRangeSearchComponent', () => {
  let component: LibRangeSearchComponent;
  let fixture: ComponentFixture<LibRangeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibRangeSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibRangeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
