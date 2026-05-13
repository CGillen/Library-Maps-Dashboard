import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BayFormComponent } from './bay-form.component';

describe('BayFormComponent', () => {
  let component: BayFormComponent;
  let fixture: ComponentFixture<BayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BayFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
