const jwt = require("jsonwebtoken");
exports.varifyToken = (req, res, next) => {
    try {
        console.log("Token :" + req.headers.authorization);

        if (!req.headers.authorization) return res.status(401).send("invalid token");

        if (req.headers.authorization == null)
            return res.status(401).send("unauthorished1 request");

        let token = req.headers.authorization.split(" ")[1];
        let paylod = jwt.verify(token, "abcdefghijklm");
        console.log(paylod);
        next();
    } catch (err) {
        return res.status(401).send("unauthorised request");
    }
};