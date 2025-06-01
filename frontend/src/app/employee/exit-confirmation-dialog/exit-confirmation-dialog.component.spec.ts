import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitConfirmationDialogComponent } from './exit-confirmation-dialog.component';

describe('ExitConfirmationDialogComponent', () => {
  let component: ExitConfirmationDialogComponent;
  let fixture: ComponentFixture<ExitConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitConfirmationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
