const { register, login, setAvatar, getAllUsers, setSettings, searchForUsers, addNewContact } = require("../controllers/userController");

const router = require('express').Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.post('/setsettings/:id', setSettings);
router.get('/searchforusers/:id/:value', searchForUsers);
router.post('/addnewcontact/:id', addNewContact);

module.exports = router;