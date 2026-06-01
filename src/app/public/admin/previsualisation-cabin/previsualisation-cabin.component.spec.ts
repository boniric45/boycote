import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisualisationCabinComponent } from './previsualisation-cabin.component';

describe('PrevisualisationCabinComponent', () => {
  let component: PrevisualisationCabinComponent;
  let fixture: ComponentFixture<PrevisualisationCabinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevisualisationCabinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevisualisationCabinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
