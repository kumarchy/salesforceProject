public with sharing class PatientSubmissionPublisher {
    @AuraEnabled
    public static void publishEvent(Map<String, Object> recordData) {
        try {
            Map<Object, Object> patientData = (Map<Object, Object>) recordData.get('patient');
            Map<Object, Object> contactData = (Map<Object, Object>) recordData.get('contact');
            Map<Object, Object> oppData = (Map<Object, Object>) recordData.get('opportunity');

            PatientSubmission__e evt = new PatientSubmission__e(
                Patient_Name__c = (String) patientData.get('name'),
                DOB__c = patientData.get('dob') != null ? Date.valueOf((String) patientData.get('dob')) : null,
                Patient_Phone__c = (String) patientData.get('phone'),
                Patient_Email__c = (String) patientData.get('email'),
                Contact_Name__c = (String) contactData.get('name'),
                Contact_Phone__c = (String) contactData.get('phone'),
                Contact_Email__c = (String) contactData.get('email'),
                Opportunity_Name__c = (String) oppData.get('name'),
                Close_Date__c = oppData.get('closeDate') != null ? Date.valueOf((String) oppData.get('closeDate')) : null,
                Amount__c = oppData.get('amount') != null ? Decimal.valueOf(String.valueOf(oppData.get('amount'))) : 0
            );

            Database.SaveResult result = EventBus.publish(evt);

            if (!result.isSuccess()) {
                throw new AuraHandledException('Failed to publish event.');
            }

        } catch (Exception e) {
            throw new AuraHandledException('Error publishing event: ' + e.getMessage());
        }
    }
}
