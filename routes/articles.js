const express = require('express')
const router = express.Router()
const Article = require('./../models/article')

router.get('/new', (req, res) => {
    res.render('articles/new' , {article: new Article()})
})

router.get('/:slug', async (req, res) => {
    let article = await Article.findOne({slug: req.params.slug})
    if (article == null) {
        res.redirect('/')
    } else {
        res.render('articles/show' , {article})
    }
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', {article: article})
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
            res.render(`articles/${path}`, {article: article})
        }
    }
}

router.post('/', async (req, res, next) => {
   req.article = new Article()
   next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/') 
})


module.exports = router