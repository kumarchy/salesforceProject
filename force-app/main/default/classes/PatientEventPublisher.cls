public with sharing class PatientEventPublisher {
    @AuraEnabled
    public static String publishPatientEvent(
        String patientName,
        String patientEmail,
        String patientPhone,
        String contactName,
        String contactPhone,
        String opportunityName,
        String opportunityCloseDate,
        String opportunityStage,
        String caseSubject,
        String caseDescription,
        String fileDocumentIds
    ) {
        try {
            PatientFullDataEvent__e evt = new PatientFullDataEvent__e(
                Patient_Name__c = patientName,
                Patient_Email__c = patientEmail,
                Patient_Phone__c = patientPhone,
                Contact_Name__c = contactName,
                Contact_Phone__c = contactPhone,
                Opportunity_Name__c = opportunityName,
                Opportunity_Stage__c = opportunityStage,
                Case_Subject__c = caseSubject,
                Case_Description__c = caseDescription,
                File_Document_Ids__c = fileDocumentIds
            );

            if (String.isNotBlank(opportunityCloseDate)) {
                evt.Opportunity_CloseDate__c = Date.valueOf(opportunityCloseDate);
            }

            Database.SaveResult sr = EventBus.publish(evt);

            if (!sr.isSuccess()) {
                String errs = '';
                for (Database.Error e : sr.getErrors()) {
                    errs += e.getMessage() + ' ';
                }
                return 'Failed to publish event: ' + errs.trim();
            }

            return 'Event published';
        } catch (Exception ex) {
            return 'Error: ' + ex.getMessage();
        }
    }
}
