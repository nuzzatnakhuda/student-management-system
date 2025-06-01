import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterFeeGenerateDialogComponent } from './semester-fee-generate-dialog.component';

describe('SemesterFeeGenerateDialogComponent', () => {
  let component: SemesterFeeGenerateDialogComponent;
  let fixture: ComponentFixture<SemesterFeeGenerateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterFeeGenerateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemesterFeeGenerateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
