import { Directive } from '@angular/core';

@Directive({
  selector: '[appCardElevate]',
  host: {
    '[style.transition]': "'transform 180ms ease, box-shadow 180ms ease'",
    '[style.will-change]': "'transform, box-shadow'",
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
    '[style.transform]': 'transformStyle',
    '[style.box-shadow]': 'shadowStyle'
  }
})
export class CardElevateDirective {
  transformStyle = 'translateY(0)';
  shadowStyle = '0 6px 16px rgba(13, 27, 61, 0.08)';

  onEnter(): void {
    this.transformStyle = 'translateY(-2px)';
    this.shadowStyle = '0 12px 26px rgba(13, 27, 61, 0.14)';
  }

  onLeave(): void {
    this.transformStyle = 'translateY(0)';
    this.shadowStyle = '0 6px 16px rgba(13, 27, 61, 0.08)';
  }
}
