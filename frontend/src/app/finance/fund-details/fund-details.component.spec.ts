import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundDetailsComponent } from './fund-details.component';

describe('FundDetailsComponent', () => {
  let component: FundDetailsComponent;
  let fixture: ComponentFixture<FundDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
