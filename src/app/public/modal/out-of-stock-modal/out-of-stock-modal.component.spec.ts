import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutOfStockModalComponent } from './out-of-stock-modal.component';

describe('OutOfStockModalComponent', () => {
  let component: OutOfStockModalComponent;
  let fixture: ComponentFixture<OutOfStockModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutOfStockModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutOfStockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
