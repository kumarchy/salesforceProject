import { LightningElement } from 'lwc';

export default class Practice extends LightningElement {
  showChild = false;

  handleNext() {
    this.showChild = true;
  }

  handleBack() {
    this.showChild = false;
  }
}
