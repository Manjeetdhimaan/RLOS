import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDetails.ReadComponent } from './family-details.read.component';

describe('FamilyDetails.ReadComponent', () => {
  let component: FamilyDetails.ReadComponent;
  let fixture: ComponentFixture<FamilyDetails.ReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyDetails.ReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDetails.ReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
