const express=require("express")
const router = express.Router();

const userController=require("../controller/userController")
const authenticateToken=require('../middleware/auth')

//login
router.post("/login", userController.login);

// Create a new user
router.post('/user', userController.createUser);

// Get all users
router.get('/', userController.getAllUsers);

// Get one user by ID
router.get('/:id',authenticateToken, userController.getUserById);

// Update user by ID
router.put('/:id',authenticateToken, userController.updateUserById);

// Delete user by ID
router.delete('/:id',authenticateToken, userController.deleteUserById);

module.exports = router;

