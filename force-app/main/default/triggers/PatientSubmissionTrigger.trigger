trigger PatientSubmissionTrigger on PatientSubmission__e (after insert) {
    List<Account> accList = new List<Account>();
    List<Contact> contactList = new List<Contact>();
    List<Opportunity> oppList = new List<Opportunity>();

    for (PatientSubmission__e evt : Trigger.New) {
        Account acc = new Account(
            Name = evt.Patient_Name__c,
            Date_of_Birth__c = evt.DOB__c,
            Phone = evt.Patient_Phone__c,
            Email__c = evt.Patient_Email__c
        );
        accList.add(acc);
    }
    
    insert accList;

    Integer i = 0;
    for (PatientSubmission__e evt : Trigger.New) {
        Contact con = new Contact(
            LastName = evt.Contact_Name__c,
            Phone = evt.Contact_Phone__c,
            Email = evt.Contact_Email__c,
            AccountId = accList[i].Id
        );
        contactList.add(con);

        Opportunity opp = new Opportunity(
            Name = evt.Opportunity_Name__c,
            CloseDate = evt.Close_Date__c != null ? evt.Close_Date__c : System.today(),
            Amount = evt.Amount__c != null ? evt.Amount__c : 0,
            StageName = 'Prospecting',
            AccountId = accList[i].Id
        );
        oppList.add(opp);
        i++;
    }

    insert contactList;
    insert oppList;
}
