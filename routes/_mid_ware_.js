exports.checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next()
    } else {
        return res.redirect('/login')
    }
}

exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return res.redirect('/todos')
    }

    next()

}