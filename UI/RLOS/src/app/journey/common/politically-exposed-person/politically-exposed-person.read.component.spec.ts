import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticallyExposedPerson.ReadComponent } from './politically-exposed-person.read.component';

describe('PoliticallyExposedPerson.ReadComponent', () => {
  let component: PoliticallyExposedPerson.ReadComponent;
  let fixture: ComponentFixture<PoliticallyExposedPerson.ReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticallyExposedPerson.ReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticallyExposedPerson.ReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
