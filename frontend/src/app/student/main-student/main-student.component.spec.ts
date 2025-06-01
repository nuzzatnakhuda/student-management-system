import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainStudentComponent } from './main-student.component';

describe('MainStudentComponent', () => {
  let component: MainStudentComponent;
  let fixture: ComponentFixture<MainStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
