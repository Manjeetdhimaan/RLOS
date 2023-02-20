import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreScreenComponent } from './pre-screen.component';

describe('PreScreenComponent', () => {
  let component: PreScreenComponent;
  let fixture: ComponentFixture<PreScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
