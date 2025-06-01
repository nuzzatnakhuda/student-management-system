import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamFeeDetailsComponent } from './exam-fee-details.component';

describe('ExamFeeDetailsComponent', () => {
  let component: ExamFeeDetailsComponent;
  let fixture: ComponentFixture<ExamFeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamFeeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamFeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
