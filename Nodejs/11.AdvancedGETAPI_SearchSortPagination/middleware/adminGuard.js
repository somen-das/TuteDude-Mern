//D:\SOMEN\Self Practice\Nodejs\11.AdvancedGETAPI_SearchSortPagination\middleware\adminGuard.js

const checkAdmin = (req, res, next)=>{
    if(req.query.user === 'admin'){
        next()
    } else{
        res.status(403).json({
            message:`only admin can access this permission`
        })
    }
}

module.exports = {checkAdmin}