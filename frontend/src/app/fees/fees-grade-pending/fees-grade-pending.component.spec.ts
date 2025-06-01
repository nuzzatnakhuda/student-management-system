import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesGradePendingComponent } from './fees-grade-pending.component';

describe('FeesGradePendingComponent', () => {
  let component: FeesGradePendingComponent;
  let fixture: ComponentFixture<FeesGradePendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesGradePendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesGradePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
