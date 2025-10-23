import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import publishFullDataEvent from '@salesforce/apex/PatientDataEventPublisher.publishFullDataEvent';

export default class PatientFullFlow extends LightningElement {
    @track accCard = true;
    @track conCard = false;
    @track oppCard = false;
    @track caseCard = false;
    @track resView = false;

    patientName = '';
    patientEmail = '';
    patientPhone = '';
    contactName = '';
    contactPhone = '';
    opportunityName = '';
    opportunityCloseDate = '';
    opportunityStage = '';
    caseSubject = '';
    caseDescription = '';
    uploadedFiles = [];

    acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'];

    get stageOptions() {
        return [
            { label: 'Prospecting', value: 'Prospecting' },
            { label: 'Qualification', value: 'Qualification' },
            { label: 'Needs Analysis', value: 'Needs Analysis' },
            { label: 'Value Proposition', value: 'Value Proposition' },
            { label: 'Id. Decision Makers', value: 'Id. Decision Makers' },
            { label: 'Perception Analysis', value: 'Perception Analysis' },
            { label: 'Proposal/Price Quote', value: 'Proposal/Price Quote' },
            { label: 'Negotiation/Review', value: 'Negotiation/Review' },
            { label: 'Closed Won', value: 'Closed Won' },
            { label: 'Closed Lost', value: 'Closed Lost' }
        ];
    }

    onPatientNameChange(e) { this.patientName = e.target.value; }
    onPatientEmailChange(e) { this.patientEmail = e.target.value; }
    onPatientPhoneChange(e) { this.patientPhone = e.target.value; }
    onContactNameChange(e) { this.contactName = e.target.value; }
    onContactPhoneChange(e) { this.contactPhone = e.target.value; }
    onOpportunityNameChange(e) { this.opportunityName = e.target.value; }
    onOpportunityCloseDateChange(e) { this.opportunityCloseDate = e.target.value; }
    onOpportunityStageChange(e) { this.opportunityStage = e.target.value; }
    onCaseSubjectChange(e) { this.caseSubject = e.target.value; }
    onCaseDescriptionChange(e) { this.caseDescription = e.target.value; }

    goToContact() {
        if (!this.patientName || !this.patientEmail || !this.patientPhone) {
            this.showToast('Error', 'Please fill all patient fields', 'error');
            return;
        }
        this.accCard = false;
        this.conCard = true;
    }

    goToOpportunity() {
        if (!this.contactName || !this.contactPhone) {
            this.showToast('Error', 'Please fill all contact fields', 'error');
            return;
        }
        this.conCard = false;
        this.oppCard = true;
    }

    goToCase() {
        if (!this.opportunityName || !this.opportunityCloseDate || !this.opportunityStage) {
            this.showToast('Error', 'Please fill opportunity fields', 'error');
            return;
        }
        this.oppCard = false;
        this.caseCard = true;
    }

    onFileUploadFinished(event) {
        const files = event.detail.files;
        if (files && files.length > 0) {
            this.uploadedFiles = files.map(f => f.contentVersionId);
            this.showToast('Success', `${files.length} file(s) uploaded successfully`, 'success');
        }
    }

    submitAll() {
        if (!this.caseSubject || !this.caseDescription) {
            this.showToast('Error', 'Please fill case subject and description', 'error');
            return;
        }

        const fileIdsCsv = this.uploadedFiles.join(',');

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
            fileDocumentIds: fileIdsCsv 
        })
            .then(result => {
                if (result.startsWith('Failed') || result.startsWith('Error')) {
                    this.showToast('Error', result, 'error');
                } else {
                    this.caseCard = false;
                    this.resView = true;
                    this.showToast('Success', 'Records created successfully', 'success');
                }
            })
            .catch(error => {
                this.showToast('Error', 'Error publishing event', 'error');
                console.error(error);
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
