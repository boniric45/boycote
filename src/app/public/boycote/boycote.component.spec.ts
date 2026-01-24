import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoycoteComponent } from './boycote.component';

describe('BoycoteComponent', () => {
  let component: BoycoteComponent;
  let fixture: ComponentFixture<BoycoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoycoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoycoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
