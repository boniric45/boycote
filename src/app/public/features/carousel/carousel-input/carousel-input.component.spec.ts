import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselInputComponent } from './carousel-input.component';

describe('CarouselInputComponent', () => {
  let component: CarouselInputComponent;
  let fixture: ComponentFixture<CarouselInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
