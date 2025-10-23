pipeline {
    agent any

    tools {
        custom 'SFDX_CLI'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Deploy to Scratch Org') {
            steps {
                withEnv(["PATH+SFDX=${tool 'SFDX_CLI'}/bin"]) {
                    sh 'sfdx force:org:list'
                    sh 'sfdx force:source:deploy -p force-app -u MyScratchOrg'
                    sh 'sfdx force:apex:test:run -u MyScratchOrg --resultformat human'
                }
            }
        }
    }
}
