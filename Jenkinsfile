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
                // Replace this with the actual installation path of sfdx.exe
                withEnv(["PATH=C:\\Program Files\\sf\\bin;${env.PATH}"]) {
                    bat 'sfdx --version'
                    bat 'sfdx force:org:list'
                    bat 'sfdx force:source:deploy -p force-app -u MyScratchOrg'
                    bat 'sfdx force:apex:test:run -u MyScratchOrg --resultformat human'
                }
            }
        }
    }
}
