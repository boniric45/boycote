import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinUpdateComponent } from './cabin-update.component';

describe('CabinUpdateComponent', () => {
  let component: CabinUpdateComponent;
  let fixture: ComponentFixture<CabinUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
