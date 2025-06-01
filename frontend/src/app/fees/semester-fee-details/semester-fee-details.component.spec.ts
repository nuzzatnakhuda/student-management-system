import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterFeeDetailsComponent } from './semester-fee-details.component';

describe('SemesterFeeDetailsComponent', () => {
  let component: SemesterFeeDetailsComponent;
  let fixture: ComponentFixture<SemesterFeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterFeeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemesterFeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
