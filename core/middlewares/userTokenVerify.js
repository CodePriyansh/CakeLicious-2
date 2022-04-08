const jwt = require('jsonwebtoken')

const verifyToken = (request, response, next)=> {
    const token =
    request.body.token || request.query.token || request.headers.authorization

if (!token) {
    return res.status(403).json("A token is required for authentication")
}
try {
    const decoded = jwt.verify(token, config.TOKEN_KEY)
    request.customer = decoded.customer
} catch (err) {
    return res.status(401).json({err: "Invalid Token" + err})
}
return next()
}

module.exports = verifyToken