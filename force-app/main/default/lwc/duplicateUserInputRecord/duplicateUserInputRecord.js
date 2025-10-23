import { LightningElement, track } from 'lwc';
// import createRecords from '@salesforce/apex/duplicateUserRecordController.createRecords';
import publishEvent from '@salesforce/apex/PatientSubmissionPublisher.publishEvent';

export default class DuplicateUserInputRecord extends LightningElement {
     @track currentStep = 1;
    
        name = '';
        dob = '';
        phone = '';
        email = '';
    
        contactName = '';
        contactPhone = '';
        contactEmail = '';
    
        oppName = '';
        closeDate = '';
        amount = '';
    
        get isStepOne() { return this.currentStep === 1; }
        get isStepTwo() { return this.currentStep === 2; }
        get isStepThree() { return this.currentStep === 3; }
    
        get isNextDisabled() {
            if (this.currentStep === 1) {
                return !(
                    this.validateName(this.name) &&
                    this.dob &&
                    this.validatePhone(this.phone) &&
                    this.validateEmail(this.email)
                );
            } else if (this.currentStep === 2) {
                return !(
                    this.validateName(this.contactName) &&
                    this.validatePhone(this.contactPhone) &&
                    this.validateEmail(this.contactEmail)
                );
            }
            return false;
        }
    
        handleAccountNameChange(event) { this.name = event.target.value; }
        handleDOBChange(event) { this.dob = event.target.value; }
        handlePhoneChange(event) { this.phone = event.target.value; }
        handleEmailChange(event) { this.email = event.target.value; }
    
        handleContactNameChange(event) { this.contactName = event.target.value; }
        handleContactPhoneChange(event) { this.contactPhone = event.target.value; }
        handleContactEmailChange(event) { this.contactEmail = event.target.value; }
    
        handleOppNameChange(event) { this.oppName = event.target.value; }
        handleCloseDateChange(event) { this.closeDate = event.target.value; }
        handleAmountChange(event) { this.amount = event.target.value; }
    
        validateName(name) { return /^[A-Za-z\s]+$/.test(name); }
        validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
        validatePhone(phone) { return /^[0-9]{10}$/.test(phone); }
    
        goToNextStep() {
            if (this.currentStep < 3) {
                this.currentStep++;
            }
        }
    
        goToPreviousStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
            }
        }
    
        handleSubmit() {
    const recordData = {
        patient: {
            name: this.name,
            dob: this.dob,
            phone: this.phone,
            email: this.email
        },
        contact: {
            name: this.contactName,
            phone: this.contactPhone,
            email: this.contactEmail
        },
        opportunity: {
            name: this.oppName,
            closeDate: this.closeDate,
            amount: this.amount
        }
    };

    publishEvent({ recordData })
        .then(() => {
            alert('Submission received! Records will be created shortly.');
            this.currentStep = 1;
            this.resetForm();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting data: ' + error.body.message);
        });
    
        }
    
        resetForm() {
            this.name = '';
            this.dob = '';
            this.phone = '';
            this.email = '';
            this.contactName = '';
            this.contactPhone = '';
            this.contactEmail = '';
            this.oppName = '';
            this.closeDate = '';
            this.amount = '';
        }
}