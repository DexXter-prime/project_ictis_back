const express = require('express')
const router = express.Router()
const Article = require('./../models/article_model')
const {checkAuthenticated, checkNotAuthenticated} = require('./_mid_ware_')


router.get('/', checkAuthenticated, async (req, res) => {
    let articles = await Article.find().sort( {currentDate: 'desc'})
    res.render('articles/index', {articles: articles, user: req.user})
})

router.get('/new', checkAuthenticated, (req, res) => {
    res.render('articles/new' , {article: new Article(), user: req.user})
})

router.get('/:slug', checkAuthenticated, async (req, res) => {
    let article = await Article.findOne({slug: req.params.slug})
    if (article == null) {
        res.redirect('/')
    } else {
        res.render('articles/show' , {article: article, user: req.user})
    }
})

router.get('/edit/:id', checkAuthenticated, async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article, user: req.user})
})

const saveArticleAndRedirect = (path) => {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.teacher = req.body.teacher
        article.dateDefense  = req.body.dateDefense
        article.status = req.body.status

        console.log(req.body.dateDefense)
        console.log(typeof req.body.dateDefense)

        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            console.log(`ERROR IS ${e}`)
            res.render(`articles/${path}`, {article: article, user: req.user})
        }
    }
}

router.post('/', checkAuthenticated, async (req, res, next) => {
   req.article = new Article()
   next()
}, saveArticleAndRedirect('new'))

router.put('/:id', checkAuthenticated, async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', checkAuthenticated, async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/') 
})


module.exports = router