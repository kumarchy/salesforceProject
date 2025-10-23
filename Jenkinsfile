pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Deploy to Salesforce') {
            steps {
                // Replace this with the path where your SFDX CLI is installed
                withEnv(["PATH=C:\\Program Files\\sf\\bin;${env.PATH}"]) {
                    bat 'sfdx force:org:list'
                    bat 'sfdx force:source:deploy -p force-app -u MyScratchOrg'
                    bat 'sfdx force:apex:test:run -u MyScratchOrg --resultformat human'
                }
            }
        }
    }
}
