import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesGradeComponent } from './fees-grade.component';

describe('FeesGradeComponent', () => {
  let component: FeesGradeComponent;
  let fixture: ComponentFixture<FeesGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesGradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
