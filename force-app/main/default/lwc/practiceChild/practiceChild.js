import { LightningElement, api } from 'lwc';

export default class PracticeChild extends LightningElement {
  @api first;
  @api second;
  @api third;

  get sum12() {
    const a = Number(this.first) || 0;
    const b = Number(this.second) || 0;
    return a + b;
  }

  get sum23() {
    const b = Number(this.second) || 0;
    const c = Number(this.third) || 0;
    return b + c;
  }

  handleBack() {
    this.dispatchEvent(new CustomEvent('back'));
  }
}
