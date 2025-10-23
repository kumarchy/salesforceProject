trigger AccountUpdateEventTrigger on Account_Update_Event__e (after insert) {
    List<Account> accountsToUpdate = new List<Account>();

    for (Account_Update_Event__e eventRecord : Trigger.New) {
        if (eventRecord.Account_Id__c != null) {
            Account acc = new Account(
                Id = eventRecord.Account_Id__c	
            );
            if (eventRecord.Name__c != null) acc.Name = eventRecord.Name__c;
            if (eventRecord.Phone__c != null) acc.Phone = eventRecord.Phone__c;
            if (eventRecord.Email__c != null) acc.Email__c = eventRecord.Email__c;

            accountsToUpdate.add(acc);
        }
    }

    if (!accountsToUpdate.isEmpty()) {
        update accountsToUpdate;
    }
}
