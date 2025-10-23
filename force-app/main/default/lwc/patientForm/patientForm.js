import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import publishFullDataEvent from '@salesforce/apex/PatientDataEventPublisher.publishFullDataEvent';

export default class PatientForm extends LightningElement {
    @track patientName = '';
    @track patientEmail = '';
    @track patientPhone = '';
    @track contactName = '';
    @track contactPhone = '';
    @track opportunityName = '';
    @track opportunityCloseDate = '';
    @track opportunityStage = '';
    @track caseSubject = '';
    @track caseDescription = '';

    get stageOptions() {
        return [
            { label: 'Prospecting', value: 'Prospecting' },
            { label: 'Qualification', value: 'Qualification' },
            { label: 'Needs Analysis', value: 'Needs Analysis' },
            { label: 'Value Proposition', value: 'Value Proposition' },
            { label: 'Closed Won', value: 'Closed Won' },
            { label: 'Closed Lost', value: 'Closed Lost' }
        ];
    }

    handleChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
    }

    submitData() {
        publishFullDataEvent({
            patientName: this.patientName,
            patientEmail: this.patientEmail,
            patientPhone: this.patientPhone,
            contactName: this.contactName,
            contactPhone: this.contactPhone,
            opportunityName: this.opportunityName,
            opportunityCloseDate: this.opportunityCloseDate,
            opportunityStage: this.opportunityStage,
            caseSubject: this.caseSubject,
            caseDescription: this.caseDescription,
            fileDocumentIds: ''
        })
        .then(result => {
            this.showToast('Success', result, 'success');
            this.resetForm();
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
            console.error(error);
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

    resetForm() {
        this.patientName = '';
        this.patientEmail = '';
        this.patientPhone = '';
        this.contactName = '';
        this.contactPhone = '';
        this.opportunityName = '';
        this.opportunityCloseDate = '';
        this.opportunityStage = '';
        this.caseSubject = '';
        this.caseDescription = '';
    }
}
