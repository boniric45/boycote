import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselStandardComponent } from './carousel-standard.component';

describe('CarouselStandardComponent', () => {
  let component: CarouselStandardComponent;
  let fixture: ComponentFixture<CarouselStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselStandardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
