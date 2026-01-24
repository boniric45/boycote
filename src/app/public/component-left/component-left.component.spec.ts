import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentLeftComponent } from './component-left.component';

describe('ComponentLeftComponent', () => {
  let component: ComponentLeftComponent;
  let fixture: ComponentFixture<ComponentLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentLeftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
