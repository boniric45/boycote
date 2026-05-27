import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabineVirtuellePreviewComponent } from './cabine-virtuelle-preview.component';

describe('CabineVirtuellePreviewComponent', () => {
  let component: CabineVirtuellePreviewComponent;
  let fixture: ComponentFixture<CabineVirtuellePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabineVirtuellePreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabineVirtuellePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
