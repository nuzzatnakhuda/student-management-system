import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetIncomeDialogComponent } from './get-income-dialog.component';

describe('GetIncomeDialogComponent', () => {
  let component: GetIncomeDialogComponent;
  let fixture: ComponentFixture<GetIncomeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetIncomeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetIncomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
