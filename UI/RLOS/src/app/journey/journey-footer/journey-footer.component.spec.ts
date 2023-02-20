import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyFooterComponent } from './journey-footer.component';

describe('JourneyFooterComponent', () => {
  let component: JourneyFooterComponent;
  let fixture: ComponentFixture<JourneyFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneyFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
