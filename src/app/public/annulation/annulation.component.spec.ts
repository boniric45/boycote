import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnulationComponent } from './annulation.component';

describe('AnnulationComponent', () => {
  let component: AnnulationComponent;
  let fixture: ComponentFixture<AnnulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
