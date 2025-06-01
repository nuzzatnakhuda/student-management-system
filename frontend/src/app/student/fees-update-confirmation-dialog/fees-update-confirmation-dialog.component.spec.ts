import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesUpdateConfirmationDialogComponent } from './fees-update-confirmation-dialog.component';

describe('FeesUpdateConfirmationDialogComponent', () => {
  let component: FeesUpdateConfirmationDialogComponent;
  let fixture: ComponentFixture<FeesUpdateConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesUpdateConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesUpdateConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
