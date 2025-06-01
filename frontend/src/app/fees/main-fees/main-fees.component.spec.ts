import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFeesComponent } from './main-fees.component';

describe('MainFeesComponent', () => {
  let component: MainFeesComponent;
  let fixture: ComponentFixture<MainFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
