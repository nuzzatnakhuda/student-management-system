import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExamFeeComponent } from './view-exam-fee.component';

describe('ViewExamFeeComponent', () => {
  let component: ViewExamFeeComponent;
  let fixture: ComponentFixture<ViewExamFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewExamFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExamFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
