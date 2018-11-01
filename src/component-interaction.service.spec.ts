import { TestBed } from '@angular/core/testing';

import { ComponentInteractionService } from './component-interaction.service';

describe('EventEmitterServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentInteractionService = TestBed.get(ComponentInteractionService);
    expect(service).toBeTruthy();
  });
});
