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

export { signToken }