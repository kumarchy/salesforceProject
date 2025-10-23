public with sharing class AccountEventPublisher {
    @AuraEnabled
    public static void publishAccountUpdate(Account acc) {
        Account_Update_Event__e eventRecord = new Account_Update_Event__e(
            Account_Id__c = acc.Id,
            Name__c = acc.Name,
            Phone__c = acc.Phone,
            Email__c = acc.Email__c
        );

        Database.SaveResult result = EventBus.publish(eventRecord);

        if (!result.isSuccess()) {
            throw new AuraHandledException('Failed to publish platform event');
        }
    }
}
