public without sharing class UserRecordController {
    @AuraEnabled
    public static String createRecords(Map<String, Object> recordData) {
        try {
            Map<String, Object> mainData = 
                (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(recordData));

            Map<String, Object> patientData = (Map<String, Object>) mainData.get('patient');
            Map<String, Object> contactData = (Map<String, Object>) mainData.get('contact');
            Map<String, Object> oppData = (Map<String, Object>) mainData.get('opportunity');

            Account account = new Account(
                Name = (String) patientData.get('name'),
                Date_of_Birth__c = patientData.get('dob') != null ? Date.valueOf((String) patientData.get('dob')) : null,
                Phone = (String) patientData.get('phone'),
                Email__c = (String) patientData.get('email')
            );
            
            insert account;

            Contact contact = new Contact(
                LastName = (String) contactData.get('name'),
                Email = (String) contactData.get('email'),
                Phone = (String) contactData.get('phone'),
                AccountId = account.Id
            );
            insert contact;

            Opportunity opp = new Opportunity(
                Name = (String) oppData.get('name'),
                CloseDate = oppData.get('closeDate') != null 
                    ? Date.valueOf((String) oppData.get('closeDate')) 
                    : System.today(),
                Amount = oppData.get('amount') != null 
                    ? Decimal.valueOf(String.valueOf(oppData.get('amount'))) 
                    : 0,
                StageName = 'Prospecting',
                AccountId = account.Id
            );
            insert opp;

            return 'Records created successfully!';
        } 
        catch (Exception e) {
            System.debug('Error creating records: ' + e.getMessage());
            throw new AuraHandledException('Error while creating records: ' + e.getMessage());
        }
    }
}