import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPromotionDialogComponent } from './student-promotion-dialog.component';

describe('StudentPromotionDialogComponent', () => {
  let component: StudentPromotionDialogComponent;
  let fixture: ComponentFixture<StudentPromotionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPromotionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPromotionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
