import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolFundTransactionComponent } from './school-fund-transaction.component';

describe('SchoolFundTransactionComponent', () => {
  let component: SchoolFundTransactionComponent;
  let fixture: ComponentFixture<SchoolFundTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolFundTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolFundTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
