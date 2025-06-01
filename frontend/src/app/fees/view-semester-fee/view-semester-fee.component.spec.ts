import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSemesterFeeComponent } from './view-semester-fee.component';

describe('ViewSemesterFeeComponent', () => {
  let component: ViewSemesterFeeComponent;
  let fixture: ComponentFixture<ViewSemesterFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSemesterFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSemesterFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
