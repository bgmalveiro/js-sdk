#!groovy​

pipeline {
    agent { 
        label 'jenkins-slave' 
    }
    environment {
        VERSION = "0.0.${BUILD_NUMBER}"
    }
    stages {
        stage('Setup') {
            steps {
                sh "git clean -xfd"
            }
        }

        stage('Build') {
            steps {
                sh "pipeline/scripts/01-build.sh ${VERSION}"
            }
        }

        stage('Test') {
            steps {
                sh "pipeline/scripts/02-test.sh ${VERSION}"
            }
        }

        stage('Publish') {
            steps {
                sshagent(credentials : ['mapify-github']) {
                    withCredentials([
                        usernamePassword(credentialsId: 'sdk-js-npm-user', usernameVariable: 'NPM_USER', passwordVariable: 'NPM_PASSWORD')
                    ]) {
                        script {
                            ( NPM_USERNAME, NPM_EMAIL ) = NPM_USER.tokenize(' | ')
                        }
                        sh "pipeline/scripts/03-publish.sh ${VERSION} '${NPM_USERNAME}' '${NPM_EMAIL}' '${NPM_PASSWORD}'"
                    }
                }
            }
        }
    }
}