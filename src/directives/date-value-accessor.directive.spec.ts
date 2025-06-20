import { DateValueAccessorDirective } from './date-value-accessor.directive';

describe('DateValueAccessorDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = { nativeElement: document.createElement('input') } as any;
    const directive = new DateValueAccessorDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
