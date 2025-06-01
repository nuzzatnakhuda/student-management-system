import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesGradePaidComponent } from './fees-grade-paid.component';

describe('FeesGradePaidComponent', () => {
  let component: FeesGradePaidComponent;
  let fixture: ComponentFixture<FeesGradePaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesGradePaidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesGradePaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
