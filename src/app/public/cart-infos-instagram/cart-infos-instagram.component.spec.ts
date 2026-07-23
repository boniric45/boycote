import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartInfosInstagramComponent } from './cart-infos-instagram.component';

describe('CartInfosInstagramComponent', () => {
  let component: CartInfosInstagramComponent;
  let fixture: ComponentFixture<CartInfosInstagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartInfosInstagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartInfosInstagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
