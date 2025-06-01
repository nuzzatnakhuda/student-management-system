import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAddDialogComponent } from './section-add-dialog.component';

describe('SectionAddDialogComponent', () => {
  let component: SectionAddDialogComponent;
  let fixture: ComponentFixture<SectionAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionAddDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
