import { LightningElement, track, wire } from 'lwc';
import getAccountByStatus from '@salesforce/apex/AccountController.getAccountByStatus';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import ID_FIELD from '@salesforce/schema/Account.Id';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import ACTIVE_FIELD from '@salesforce/schema/Account.Active__c';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Industry', fieldName: 'Industry' },
    {
        type: 'button',
        typeAttributes: {
            label: 'View',
            name: 'view',
            variant: 'brand'
        }
    }
];

export default class AccountDisplayTable extends LightningElement {
    @track activeAccounts = [];
    @track deactiveAccounts = [];
    @track error;
    @track isModalOpen = false;
    @track selectedAccount = {};

    wiredResult;
    columns = COLUMNS;

    @wire(getAccountByStatus)
    wiredAccount(result) {
        this.wiredResult = result;

        if (result.data) {
            this.activeAccounts = result.data.Active || [];
            this.deactiveAccounts = result.data.Deactive || [];
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.activeAccounts = [];
            this.deactiveAccounts = [];
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'view') {
            this.selectedAccount = { ...row };
            this.isModalOpen = true;
        }
    }

    handleChange(event) {
        const field = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.selectedAccount = { ...this.selectedAccount, [field]: value };
    }

    handleSave() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.selectedAccount.Id;
        fields[NAME_FIELD.fieldApiName] = this.selectedAccount.Name;
        fields[PHONE_FIELD.fieldApiName] = this.selectedAccount.Phone;
        fields[INDUSTRY_FIELD.fieldApiName] = this.selectedAccount.Industry;
        fields[ACTIVE_FIELD.fieldApiName] = this.selectedAccount.Active__c;

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.isModalOpen = false;
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.error = error;
                console.error('Update error:', error);
            });
    }

    closeModal() {
        this.isModalOpen = false;
    }
}
