import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarComponent } from './grammar.component';

describe('GrammarComponent', () => {
  let component: GrammarComponent;
  let fixture: ComponentFixture<GrammarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrammarComponent]
    });
    fixture = TestBed.createComponent(GrammarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
