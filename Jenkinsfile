pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-u root:root'  // allow installing deps
        }
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install') {
            steps { sh 'npm ci' }
        }

        stage('Lint') {
            steps { sh 'npx eslint . || true' } // optional if you add ESLint
        }

        stage('Unit Tests') {
            steps { sh 'npm test' }
        }

        stage('Package Artifact') {
            steps {
                sh 'tar czf hello-world-app.tar.gz src package.json package-lock.json'
                archiveArtifacts artifacts: 'hello-world-app.tar.gz', onlyIfSuccessful: true
            }
        }
    }

}
