import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxformComponent } from './rxform.component';

describe('RxformComponent', () => {
  let component: RxformComponent;
  let fixture: ComponentFixture<RxformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
