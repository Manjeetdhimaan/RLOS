import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticallyExposedPersonComponent } from './politically-exposed-person.component';

describe('PoliticallyExposedPersonComponent', () => {
  let component: PoliticallyExposedPersonComponent;
  let fixture: ComponentFixture<PoliticallyExposedPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticallyExposedPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticallyExposedPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
