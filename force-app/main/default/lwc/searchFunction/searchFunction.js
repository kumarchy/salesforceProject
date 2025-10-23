import { LightningElement, track } from 'lwc';
import searchAccounts from '@salesforce/apex/AccountSearchController.searchAccounts';
import updateAccountRecord from '@salesforce/apex/AccountSearchController.updateAccount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import publishAccountUpdate from '@salesforce/apex/AccountEventPublisher.publishAccountUpdate';

export default class SearchFunction extends LightningElement {
@track searchKey = '';
@track accounts = [];
@track selectedAccount = null;
delayTimeout;

columns = [
{ label: 'Name', fieldName: 'Name' },
{ label: 'Phone', fieldName: 'Phone' },
{ label: 'Email', fieldName: 'Email__c' },
{
type: 'button',
typeAttributes: {
label: 'Edit',
name: 'edit',
variant: 'brand'
}
}
];

handleSearchInput(event) {
this.searchKey = event.target.value;
clearTimeout(this.delayTimeout);
this.delayTimeout = setTimeout(() => {
this.runSearch();
}, 400);
}

runSearch() {
if (!this.searchKey || this.searchKey.trim() === '') {
this.accounts = [];
return;
}

searchAccounts({ searchKey: this.searchKey })
.then(result => {
this.accounts = result;
})
.catch(error => {
console.error('Error searching:', error);
this.showToast('Error', error.body.message, 'error');
});
}

handleRowAction(event) {
const action = event.detail.action.name;
const row = event.detail.row;
if (action === 'edit') {
this.selectedAccount = { ...row };
}
}

handleFieldChange(event) {
const field = event.target.dataset.field;
this.selectedAccount[field] = event.target.value;
}

updateAccount() {
    publishAccountUpdate({ acc: this.selectedAccount })
    .then(() => {
        this.showToast('Success', 'Update request sent successfully (via Platform Event)', 'success');
        this.selectedAccount = null;
        this.runSearch();
    })
    .catch(error => {
        this.showToast('Error', error.body.message, 'error');
    });
}


showToast(title, message, variant) {
this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
}
}