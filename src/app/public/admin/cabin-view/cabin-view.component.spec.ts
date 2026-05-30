import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinViewComponent } from './cabin-view.component';

describe('CabinViewComponent', () => {
  let component: CabinViewComponent;
  let fixture: ComponentFixture<CabinViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
