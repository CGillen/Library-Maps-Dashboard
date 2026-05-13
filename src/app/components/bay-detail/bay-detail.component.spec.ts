import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BayDetailComponent } from './bay-detail.component';

describe('BayDetailComponent', () => {
  let component: BayDetailComponent;
  let fixture: ComponentFixture<BayDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BayDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
