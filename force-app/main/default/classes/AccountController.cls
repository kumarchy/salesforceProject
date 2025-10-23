public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static Map<String, List<Account>> getAccountByStatus() {
        Map<String, List<Account>> results = new Map<String, List<Account>>();
        
        results.put('Active', [Select Id, Name, Phone, Industry, Active__c 
             FROM Account WHERE Active__c = true LIMIT 100]);
        
        results.put('Deactive', [Select Id, Name, Phone, Industry, Active__c 
             FROM Account WHERE Active__c = false LIMIT 100]);
        
        return results;
    }
}