import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanProductOverlay } from './loan-product.component';

describe('LoanProductComponent', () => {
  let component: LoanProductOverlay;
  let fixture: ComponentFixture<LoanProductOverlay>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanProductOverlay ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanProductOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
