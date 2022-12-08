const User = require("../models/User");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");

exports.createUser = asyncErrorHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password, avatar: {
            public_id: "123456",
            url: "firstImage"
        }
    });
    const token = user.getJwtToken();
    return res.status(201).json({
        success: true,
        token
    });

})