import Router from 'express';
import { forgotPassword, getUser, userLogin, userSignup, userSocialLogin } from '../Controller/userController.js';
import { userAuthenticate } from '../Middleware/userMiddleware.js';

const userRouter = Router();

userRouter.route('/signup').post(userSignup);
userRouter.route('/socialogin').post(userSocialLogin);
userRouter.route('/login').post(userLogin);
userRouter.route('/forgot-password').post(forgotPassword);
userRouter.route('/profile').get(userAuthenticate , getUser);

export default userRouter;