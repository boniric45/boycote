import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCabinComponent } from './view-cabin.component';

describe('ViewCabinComponent', () => {
  let component: ViewCabinComponent;
  let fixture: ComponentFixture<ViewCabinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCabinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCabinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
