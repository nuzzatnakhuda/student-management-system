import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeExpenseDialogComponent } from './make-expense-dialog.component';

describe('MakeExpenseDialogComponent', () => {
  let component: MakeExpenseDialogComponent;
  let fixture: ComponentFixture<MakeExpenseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeExpenseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeExpenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
