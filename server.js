require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article_model')
const methodOverride = require('method-override')
const app = express()
const articleRouter = require('./routes/articles')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const authRoute = require('./routes/auth.js')
const initializePassport = require('./passport-config')
const URI = 'mongodb+srv://Dixer:1234@cluster0.vfqws.mongodb.net/handleTodos?retryWrites=true&w=majority'

try {
    mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
        console.log('DataBase has been connected ')
    })
} catch (e) {
    console.log(`Could not connect ${e}`)
}


initializePassport(passport)

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())
app.use('/articles', articleRouter)
app.use('/', authRoute)



app.get('/', (req, res) => {
    res.redirect('/articles')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`The server has started on the port ${PORT}`))