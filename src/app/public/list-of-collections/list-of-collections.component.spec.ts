import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCollectionsComponent } from './list-of-collections.component';

describe('ListOfCollectionsComponent', () => {
  let component: ListOfCollectionsComponent;
  let fixture: ComponentFixture<ListOfCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
