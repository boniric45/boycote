import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldermacComponent } from './foldermac.component';

describe('FoldermacComponent', () => {
  let component: FoldermacComponent;
  let fixture: ComponentFixture<FoldermacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoldermacComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoldermacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
