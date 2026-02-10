import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSortListComponent } from './carousel-sort-list.component';

describe('CarouselSortListComponent', () => {
  let component: CarouselSortListComponent;
  let fixture: ComponentFixture<CarouselSortListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselSortListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselSortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
