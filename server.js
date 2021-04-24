const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const methodOverride = require('method-override')
const app = express()
const articleRouter = require('./routes/articles')
const URI = 'mongodb+srv://Dex:123@cluster0.s2fmp.mongodb.net/handleTheProjec?retryWrites=true&w=majority'

try {
    mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
        console.log('DataBase has been connected ')
    })
} catch (e) {
    console.log(`Could not connect ${e}`)
}


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use('/articles', articleRouter)

app.get('/', async (req, res) => {
    let articles = await Article.find().sort( {currentDate: 'desc'})
    res.render('articles/index', {articles: articles})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`The server has started on the port ${PORT}`))