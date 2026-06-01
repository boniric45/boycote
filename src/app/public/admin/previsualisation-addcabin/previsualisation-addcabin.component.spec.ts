import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisualisationAddcabinComponent } from './previsualisation-addcabin.component';

describe('PrevisualisationAddcabinComponent', () => {
  let component: PrevisualisationAddcabinComponent;
  let fixture: ComponentFixture<PrevisualisationAddcabinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevisualisationAddcabinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevisualisationAddcabinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
