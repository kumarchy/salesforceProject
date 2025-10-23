import { LightningElement, track} from 'lwc';
 
export default class SendMessage extends LightningElement {
    @track patientName = '';
    @track email = '';
    @track phone = '';
    @track submitted = false;
 
    handleChange(event) {
        const field = event.target.dataset.field;
        if (field === 'name') this.patientName = event.target.value;
        else if (field === 'email') this.email = event.target.value;
        else if (field === 'phone') this.phone = event.target.value;
    }
 
    handleSubmit() {
        const flow = this.template.querySelector('lightning-flow');
 
        const inputVariables = [
            { name: 'varPatientName', type: 'String', value: this.patientName },
            { name: 'varEmail', type: 'String', value: this.email },
            { name: 'varPhone', type: 'String', value: this.phone }
        ];
 
        flow.startFlow('sendMessageToPatient', inputVariables);
    }
 
    handleFlowStatusChange(event) {
        if (event.detail.status === 'FINISHED' || event.detail.status === 'FINISHED_SCREEN') {
            this.submitted = true;
        }
    }
}