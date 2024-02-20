pipeline {
  agent any
  stages {
    stage('sayhello') {
      agent {
        node {
          label 'node'
        }

      }
      steps {
        echo 'hello jenkins'
      }
    }

  }
}