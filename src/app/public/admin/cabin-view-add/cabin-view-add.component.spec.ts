import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinViewAddComponent } from './cabin-view-add.component';

describe('CabinViewAddComponent', () => {
  let component: CabinViewAddComponent;
  let fixture: ComponentFixture<CabinViewAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinViewAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinViewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
