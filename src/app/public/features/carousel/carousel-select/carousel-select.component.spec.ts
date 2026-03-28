import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSelectComponent } from './carousel-select.component';

describe('CarouselSelectComponent', () => {
  let component: CarouselSelectComponent;
  let fixture: ComponentFixture<CarouselSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
