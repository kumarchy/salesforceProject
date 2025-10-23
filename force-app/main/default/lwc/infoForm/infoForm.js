import { LightningElement, track } from 'lwc';
import createAccount from '@salesforce/apex/AccountCreater.createAccount';
export default class InfoForm extends LightningElement {
@track firstName = '';
@track lastName = '';
@track email = '';
@track phone = '';
@track address = '';
@track dob = '';
handleChange(event) {
this[event.target.name] = event.target.value;
}
handleSave() {
createAccount({
firstName: this.firstName,
lastName: this.lastName,
email: this.email,
phone: this.phone,
address: this.address,
dob: this.dob
})
.then(result => {
alert('Account created! Id: ' + result);
})
.catch(error => {
alert('Error: ' + error.body.message);
});
}
}