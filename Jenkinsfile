pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh '''pnpm i
git pull
umi build'''
      }
    }

  }
}