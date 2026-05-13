import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfSearchComponent } from './shelf-search.component';

describe('ShelfSearchComponent', () => {
  let component: ShelfSearchComponent;
  let fixture: ComponentFixture<ShelfSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelfSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelfSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
