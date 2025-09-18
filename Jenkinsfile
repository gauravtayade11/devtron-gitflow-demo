pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '30', artifactNumToKeepStr: '5'))
        timeout(time: 60, unit: 'MINUTES')
        skipDefaultCheckout(false)
    }

    environment {
        // ✅ Replace with your Devtron External CI Webhook endpoint
        DEVTRON_URL = 'http://localhost:8000/orchestrator/webhook/ext-ci/1'

        // ✅ Predefined nginx image (example)
        DOCKER_IMAGE = 'nginx:latest'
    }

    stages {

        stage('Checkout') {
            steps {
                echo "🔄 Checking out branch: ${env.BRANCH_NAME}"
                checkout scm
            }
        }

        stage('Version Management') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'develop') {
                        echo "Develop branch: updating version.txt"
                        // sh 'update version.txt for develop'
                    } else if (env.BRANCH_NAME ==~ /feature-.*/) {
                        echo "Feature branch: pulling latest version.txt from develop"
                        // sh 'git pull origin develop -- version.txt'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo "Running Maven/Node build"
                // sh 'mvn clean install' OR 'npm install && npm run build'
            }
        }

        stage('Unit Tests') {
            steps {
                echo "Running Unit Tests"
                // sh 'mvn test' OR 'npm test'
            }
        }

        // ------------------- Scans -------------------

        stage('SonarQube Scan') {
            when {
                expression { env.BRANCH_NAME ==~ /feature-.*/ }
            }
            steps {
                echo "Running SonarQube Scan"
                // sh 'mvn sonar:sonar'
            }
        }

        stage('OWASP Dependency Check') {
            when {
                expression { env.BRANCH_NAME ==~ /feature-.*/ }
            }
            steps {
                echo "Running OWASP Dependency Check"
                // sh './dependency-check.sh'
            }
        }

        stage('Gitleaks Scan') {
            when {
                expression { env.BRANCH_NAME ==~ /feature-.*/ }
            }
            steps {
                echo "Running Gitleaks Scan"
                // sh 'gitleaks detect'
            }
        }

        // ------------------- No Docker Build/Push -------------------
        // (Intentionally skipped as requested)

        stage('Version Push') {
            when {
                branch 'develop'
            }
            steps {
                echo "Pushing updated version.txt from develop"
                // sh 'git add version.txt && git commit -m "Version update" && git push'
            }
        }
    }

    // ✅ Post-job: Only trigger Devtron when develop build succeeds
    post {
        success {
            script {
                if (env.BRANCH_NAME ==~ /feature-.*/ ) {
                    echo "🚀 Commit detected on develop branch → Triggering Devtron Deployment with nginx image"

                    // 🔑 Securely pass token from Jenkins Credentials
                    withCredentials([string(credentialsId: 'DEVTRON-TOKEN', variable: 'DEVTRON_TOKEN')]) {
                        sh """
                            curl --location --request POST "$DEVTRON_URL" \\
                                --header "Content-Type: application/json" \\
                                --header "api-token: $DEVTRON_TOKEN" \\
                                --data-raw '{
                                    "dockerImage": "${DOCKER_IMAGE}",
                                }'
                        """
                    }
                } else {
                    echo "ℹ️ Not on develop branch → Devtron trigger skipped"
                }
            }
        }
        always {
            echo "✅ Pipeline finished for branch: ${env.BRANCH_NAME}"
        }
    }
}
