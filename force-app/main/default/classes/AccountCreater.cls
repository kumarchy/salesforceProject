public with sharing class AccountCreater {
@AuraEnabled
public static Id createAccount(String firstName, String lastName, String email, String phone, String
address, Date dob) {
try {
Account acc = new Account();
acc.Name = firstName + ' ' + lastName; 
acc.Phone = phone;
acc.BillingStreet = address;
acc.Email__c = email; 
acc.Date_of_Birth__c = dob; 
insert acc;
return acc.Id;
} catch (Exception e) {
throw new AuraHandledException(e.getMessage());
}
} 
}