import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTypeDialogComponent } from './fund-type-dialog.component';

describe('FundTypeDialogComponent', () => {
  let component: FundTypeDialogComponent;
  let fixture: ComponentFixture<FundTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundTypeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
