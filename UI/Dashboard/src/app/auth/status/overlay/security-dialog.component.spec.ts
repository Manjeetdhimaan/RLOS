import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityOverlay } from './security-dialog.component';

describe('SecurityDialogComponent', () => {
  let component: SecurityOverlay;
  let fixture: ComponentFixture<SecurityOverlay>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityOverlay ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
