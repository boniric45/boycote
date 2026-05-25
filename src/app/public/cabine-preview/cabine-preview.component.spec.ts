import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinePreviewComponent } from './cabine-preview.component';

describe('CabinePreviewComponent', () => {
  let component: CabinePreviewComponent;
  let fixture: ComponentFixture<CabinePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
