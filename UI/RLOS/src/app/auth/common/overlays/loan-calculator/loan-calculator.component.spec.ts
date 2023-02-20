import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCalculatorDialog } from './loan-calculator.component';

describe('LoanCalculatorDialog', () => {
  let component: LoanCalculatorDialog;
  let fixture: ComponentFixture<LoanCalculatorDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanCalculatorDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCalculatorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
