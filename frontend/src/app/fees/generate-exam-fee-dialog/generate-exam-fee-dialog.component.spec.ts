import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateExamFeeDialogComponent } from './generate-exam-fee-dialog.component';

describe('GenerateExamFeeDialogComponent', () => {
  let component: GenerateExamFeeDialogComponent;
  let fixture: ComponentFixture<GenerateExamFeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateExamFeeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateExamFeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
