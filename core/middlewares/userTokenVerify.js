const jwt = require('jsonwebtoken')
const config = process.env

const verifyToken = (request, response, next) => {
    const token =
        request.body.token || request.query.token || request.headers.authorization || request.headers["token"]

    if (!token) {
        return response.status(403).json("A token is required for authentication")
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY)
        request.customer = decoded
    } catch (err) {
        console.log("Error in token: "+err)
        return response.status(401).json({ err: "Invalid Token", error: err })
    }
    return next()
}

module.exports = verifyToken