public with sharing class AccountSearchController {
@AuraEnabled
public static List<Account> searchAccounts(String searchKey) {
if (String.isBlank(searchKey)) {
return new List<Account>();
}

String key = '%' + String.escapeSingleQuotes(searchKey) + '%';
return [
SELECT Id, Name, Phone, Email__c
FROM Account
WHERE Name LIKE :key OR Email__c LIKE :key
ORDER BY LastModifiedDate DESC
LIMIT 50
];
}

@AuraEnabled
public static void updateAccount(Account acc) {
update acc;
}
}