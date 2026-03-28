import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoycoteProductComponent } from './boycote-product.component';

describe('BoycoteProductComponent', () => {
  let component: BoycoteProductComponent;
  let fixture: ComponentFixture<BoycoteProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoycoteProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoycoteProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
