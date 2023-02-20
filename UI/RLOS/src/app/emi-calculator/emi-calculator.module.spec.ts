import { EmiCalculatorModule } from './emi-calculator.module';

describe('EmiCalculatorModule', () => {
  let emiCalculatorModule: EmiCalculatorModule;

  beforeEach(() => {
    emiCalculatorModule = new EmiCalculatorModule();
  });

  it('should create an instance', () => {
    expect(emiCalculatorModule).toBeTruthy();
  });
});
