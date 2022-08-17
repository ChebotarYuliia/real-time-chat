const { register, login, setAvatar, getAllUsers, setSettings, searchForUsers, addNewContact, deleteUserFromContacts, pinChat, unpinChat, getAllPinedChats } = require("../controllers/userController");

const router = require('express').Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setavatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.post('/setsettings/:id', setSettings);
router.get('/searchforusers/:id/:value', searchForUsers);
router.post('/addnewcontact/:id', addNewContact);
router.post('/deleteuserfromcontacts/:id', deleteUserFromContacts);
router.post('/pinchat/:id', pinChat);
router.post('/unpinchat/:id', unpinChat);
router.get('/getAllPinedChats/:id', getAllPinedChats);

module.exports = router;