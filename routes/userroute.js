const express= require('express')
const router=express.Router()
 const {createuser, login, logout, forgotpassword, resetpassword, getuserdetails, updatepassword, updateuserprofile, getallusers, getsingleuser, deleteuser, updateuserrole}  = require('../controllers/usercontroller')
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
router.route("/register").post(createuser)
router.route("/login").post(login)
router.route("/forgot-password").post(forgotpassword)
router.route("/password/reset/:token").put(resetpassword)
router.route("/logout").get(logout)
router.route("/me").get(isAuthenticatedUser, getuserdetails)
router.route("/password/updatepassword").put(isAuthenticatedUser, updatepassword)
router.route("/me/updateuserprofile").put(isAuthenticatedUser, updateuserprofile)

//get all users
router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles, getallusers)

//get single user detail
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizedRoles, getsingleuser).put(isAuthenticatedUser,authorizedRoles, updateuserrole).delete(isAuthenticatedUser,authorizedRoles, deleteuser)
module.exports = router