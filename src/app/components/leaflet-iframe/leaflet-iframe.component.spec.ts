import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletIframeComponent } from './leaflet-iframe.component';

describe('LeafletIframeComponent', () => {
  let component: LeafletIframeComponent;
  let fixture: ComponentFixture<LeafletIframeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeafletIframeComponent]
    });
    fixture = TestBed.createComponent(LeafletIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
