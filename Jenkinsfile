pipeline {
    agent any

    environment {
        SF_INSTANCE_URL = "https://login.salesforce.com"  // Change to test.salesforce.com if sandbox
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out source code from GitHub..."
                checkout scm
            }
        }

        stage('Authenticate to Salesforce') {
            steps {
                withCredentials([
                    file(credentialsId: 'sf_jwt_key', variable: 'JWT_KEYFILE'),
                    string(credentialsId: 'sf_consumer_key', variable: 'SF_CLIENT_ID'),
                    string(credentialsId: 'sf_username', variable: 'SF_USERNAME')
                ]) {
                    bat """
                        echo Authenticating to Salesforce using JWT...
                        echo Using key file at: %JWT_KEYFILE%
                        
                        dir "%JWT_KEYFILE%"
                        
                        "C:\\Program Files\\sf\\bin\\sfdx.cmd" auth:jwt:grant ^
                            --clientid "%SF_CLIENT_ID%" ^
                            --jwtkeyfile "%JWT_KEYFILE%" ^
                            --username "%SF_USERNAME%" ^
                            --instanceurl "%SF_INSTANCE_URL%" ^
                            --setdefaultdevhubusername ^
                            --setalias my-sf-org

                        if %errorlevel% neq 0 (
                            echo ❌ Authentication failed!
                            exit /b %errorlevel%
                        )

                        echo ✅ Authentication successful!
                        "C:\\Program Files\\sf\\bin\\sfdx.cmd" force:org:display --targetusername "%SF_USERNAME%"
                    """
                }
            }
        }

        stage('Deploy to Salesforce') {
            steps {
                script {
                    echo "🚀 Deploying Apex, LWC, and Triggers..."
                    def deployStatus = bat(
                        script: """
                            "C:\\Program Files\\sf\\bin\\sfdx.cmd" force:source:deploy ^
                                -p force-app\\main\\default ^
                                --targetusername "%SF_USERNAME%" ^
                                --wait 10 ^
                                --json > deployResult.json
                        """,
                        returnStatus: true
                    )

                    if (deployStatus != 0) {
                        echo "❌ Deployment failed. Check deployResult.json for details."
                        bat 'type deployResult.json'
                        error("Deployment failed!")
                    } else {
                        echo "✅ Deployment succeeded!"
                        bat 'type deployResult.json'
                    }
                }
            }
        }

        stage('Post-Deployment Summary') {
            steps {
                echo "-------------------------------------"
                echo "🎉 Salesforce Deployment Summary"
                echo "✅ All components deployed successfully!"
                echo "-------------------------------------"
            }
        }
    }

    post {
        failure {
            echo "❌ Build failed! Check the Jenkins logs and Salesforce Deployment report."
        }
        success {
            echo "✅ Build completed successfully. All Salesforce metadata deployed."
        }
    }
}
