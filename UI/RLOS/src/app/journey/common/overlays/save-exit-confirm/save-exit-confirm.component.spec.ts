import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveExitConfirmComponent } from './save-exit-confirm.component';

describe('SaveExitConfirmComponent', () => {
  let component: SaveExitConfirmComponent;
  let fixture: ComponentFixture<SaveExitConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveExitConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveExitConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
