
node {
    stage('Deploy in k8s') {
        checkout scm
        def OUT_LOG = sh(script: 'mktemp', returnStdout: true).trim()
        def OUT_LOG_COLOR = sh(script: 'mktemp', returnStdout: true).trim()
        sh "PROJECT=ccc APP=chameleon OUT_LOG=$OUT_LOG OUT_LOG_COLOR=$OUT_LOG_COLOR bash ./bin/herokutor.sh `pwd`"
        def color = readFile OUT_LOG_COLOR
        def message = readFile OUT_LOG
        slackSend color: color, message: message
    }
}
