trigger PatientFullDataEventTrigger on PatientFullDataEvent__e (after insert) {
    List<Account> accList = new List<Account>();
    List<Contact> conList = new List<Contact>();
    List<Opportunity> oppList = new List<Opportunity>();
    List<Case> caseList = new List<Case>();

    for (PatientFullDataEvent__e evt : Trigger.New) {
        Account acc = new Account(
            Name = evt.Patient_Name__c,
            Phone = evt.Patient_Phone__c
        );
        if (String.isNotBlank(evt.Patient_Email__c)) {
            acc.Email__c = evt.Patient_Email__c;
        }
        accList.add(acc);
    }

    insert accList;

    Integer index = 0;
    Map<String, Id> caseToFileMap = new Map<String, Id>(); 

    for (PatientFullDataEvent__e evt : Trigger.New) {
        Account acc = accList[index++];

        Contact con = new Contact(
            LastName = evt.Contact_Name__c,
            Phone = evt.Contact_Phone__c,
            AccountId = acc.Id
        );
        conList.add(con);

        Opportunity opp = new Opportunity(
            Name = evt.Opportunity_Name__c,
            StageName = evt.Opportunity_Stage__c,
            CloseDate = evt.Opportunity_CloseDate__c != null
                ? evt.Opportunity_CloseDate__c
                : Date.today().addDays(7),
            AccountId = acc.Id
        );
        oppList.add(opp);

        Case cs = new Case(
            Subject = evt.Case_Subject__c,
            Description = evt.Case_Description__c,
            AccountId = acc.Id,
            Origin = 'Website',
            Status = 'New'
        );
        caseList.add(cs);

        if (String.isNotBlank(evt.File_Document_Ids__c)) {
            caseToFileMap.put(evt.File_Document_Ids__c, null);
        }
    }

    insert conList;
    insert oppList;
    insert caseList;

    List<ContentDocumentLink> linksToInsert = new List<ContentDocumentLink>();

    for (Integer i = 0; i < caseList.size(); i++) {
        PatientFullDataEvent__e evt = Trigger.New[i];
        Case cs = caseList[i];

        if (String.isNotBlank(evt.File_Document_Ids__c)) {
            List<String> versionIds = evt.File_Document_Ids__c.split(',');

            List<ContentVersion> versions = [
                SELECT Id, ContentDocumentId
                FROM ContentVersion
                WHERE Id IN :versionIds
            ];

            for (ContentVersion cv : versions) {
                linksToInsert.add(new ContentDocumentLink(
                    ContentDocumentId = cv.ContentDocumentId,
                    LinkedEntityId = cs.Id, 
                    ShareType = 'V',        
                    Visibility = 'AllUsers'
                ));
            }
        }
    }

    if (!linksToInsert.isEmpty()) {
        insert linksToInsert;
    }
}
