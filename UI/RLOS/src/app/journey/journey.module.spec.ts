import { JourneyModule } from './journey.module';

describe('JourneyModule', () => {
  let journeyModule: JourneyModule;

  beforeEach(() => {
    journeyModule = new JourneyModule();
  });

  it('should create an instance', () => {
    expect(journeyModule).toBeTruthy();
  });
});
