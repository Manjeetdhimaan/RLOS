import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoapplicantDetailsComponent } from './coapplicant-details.component';

describe('CoapplicantDetailsComponent', () => {
  let component: CoapplicantDetailsComponent;
  let fixture: ComponentFixture<CoapplicantDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoapplicantDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoapplicantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
