import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeAddComponent } from './grade-add.component';

describe('GradeAddComponent', () => {
  let component: GradeAddComponent;
  let fixture: ComponentFixture<GradeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
