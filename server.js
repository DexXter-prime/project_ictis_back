require('dotenv').config()
const express = require('express')
const expressSession = require('express-session')
const app = express()
const { auth, requiresAuth } = require('express-openid-connect')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')
const articleRouter = require('./routes/articles')


try {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }, () => {
        console.log('DataBase has been connected ')
    })
} catch (e) {
    console.log(`Could not connect ${e}`)
}


app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(expressSession({secret: process.env.SECRET, resave: true, saveUninitialized: false}))
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(methodOverride('_method'))

app.use(auth({
    authRequired: false,
    enableTelemetry: false,
    idpLogout: false,
    authorizationParams: {
        response_type: 'id_token',
        scope: 'openid profile email',
        prompt: 'consent'
    }
}))

app.use('/articles', articleRouter)

app.get('/', async (req, res) => {
    let articles = await Article.find().sort( {currentDate: 'desc'})
    res.render('articles/index', {articles: articles})
})

// Example of a route that requires authorization
// req.oidc.user - information about the user
app.get('/userinfo', requiresAuth(), (req, res) => {
    let user = req.oidc.user
    res.json({user: user})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`The server has started on the port ${PORT}`))