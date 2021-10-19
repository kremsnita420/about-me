import jwt from "jsonwebtoken";

//define sign token function
const signToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,

        {
            expiresIn: '30d',
        }
    )
}

//check if user is authenticated
const isAuth = async (req, res, next) => {
    const { authorization } = req.headers
    if (authorization) {
        //verify bearer token
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'Token is not valid.' });
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'Token is not suppiled.' });
    }
};

//check if user is admin
const isAdmin = async (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'User is not Admin.' });
    }
};

export { signToken, isAuth, isAdmin }