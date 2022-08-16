const User = require('../model/userModel');
const brcypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({ msg: 'Username already used', status: false });
        };
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: 'Email already used', status: false });
        };
        const hashedPassword = await brcypt.hash(password, 10);
        const user = await User.create({
            email, username, password: hashedPassword,
        });

        delete user.password;

        return res.json({ status: true, user });

    } catch (ex) {
        next(ex);
    };
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: 'Incorrect username or password', status: false });
        };
        const isPasswordValid = await brcypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ msg: 'Incorrect username or password', status: false });
        };

        delete user.password;

        return res.json({ status: true, user });

    } catch (ex) {
        next(ex);
    };
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { new: true },
        );
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    };
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user.contacts)
        let contacts = [];
        for (let contact of user.contacts) {
            const user = await User.findById(contact).select([
                "username", "avatarImage", "_id"
            ]);
            contacts.push(user);
        };
        return res.json(contacts);
    } catch (ex) {
        next(ex);
    };
};

module.exports.setSettings = async (req, res, next) => {
    try {
        const { newUserName } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username: newUserName },
            { new: true },
        );
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.searchForUsers = async (req, res, next) => {
    try {
        const users = await User.find({
            _id: { $ne: req.params.id },
            username: { $regex: new RegExp('.*' + req.params.value + '.*', 'i') },
        }).select([
            "username", "avatarImage", "_id"
        ]);
        if (users.length > 0) {
            return res.json({ status: true, users });
        } else {
            return res.json({ status: false, msg: 'No such user' });
        }
    } catch (ex) {
        next(ex);
    }
}

module.exports.addNewContact = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const newContact = req.body.contact;
        console.log(newContact);
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                $push: { contacts: newContact }
            },
            { new: true },
        );
        return res.json({ status: true, userData });
    } catch (ex) {
        next(ex)
    };
};