const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
// console.log('rfs', rfs);

const logDirectory = path.join(__dirname, '../production_log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    size: '10M',
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'w1IqDiMeTG5nwNkRYcl2yAVKrsRl8q03',  
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        post: 587,
        secure: false,
        auth: {
        user: 'rk152531@gmail.com',
        pass: 'gaerzcvzxoihtdqn'
        }
    },
    google_client_id: "216480417720-5q0nmijbmmlftok3kj2taqtsakcipltg.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'm4ntQxDOxs9nOnMUMk8vcWaMGAsDIO5Y',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream},
        
    }
    
}


const production =  {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLINT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLINT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream},
        
    }
    
}



module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);

// module.exports = development;