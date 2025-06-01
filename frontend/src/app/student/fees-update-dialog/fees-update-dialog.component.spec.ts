import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesUpdateDialogComponent } from './fees-update-dialog.component';

describe('FeesUpdateDialogComponent', () => {
  let component: FeesUpdateDialogComponent;
  let fixture: ComponentFixture<FeesUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesUpdateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
