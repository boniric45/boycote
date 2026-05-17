import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGarmentComponent } from './add-garment.component';

describe('AddGarmentComponent', () => {
  let component: AddGarmentComponent;
  let fixture: ComponentFixture<AddGarmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGarmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGarmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
