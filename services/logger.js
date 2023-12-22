require('dotenv').config()
const fs = require('fs')
function writeToLogs(message,fs){
    let date = new Date()
    if (!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs');
    }
    fs.appendFileSync("./logs/verbose.log", `[${date.toLocaleString()}] - ${message} \n`)
}
verboseLog = (message) => {
    if(process.env.NODE_ENV == "development"){        
        console.log(message)
        //write to log file
        //create logs folder if it doesnt exist
        if(!fs){
            fs = require('fs')
            writeToLogs(message,fs)
        }else{
            writeToLogs(message,fs)
        }
    }
}

module.exports = verboseLog