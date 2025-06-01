import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesStudentComponent } from './fees-student.component';

describe('FeesStudentComponent', () => {
  let component: FeesStudentComponent;
  let fixture: ComponentFixture<FeesStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
