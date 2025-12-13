import Router from 'express';
import { createIdea, deleteIdea, getAuthorIdeas, getIdeas, suggestBestIdea, updateIdea } from '../Controller/ideaController.js';
import { userAuthenticate } from '../Middleware/userMiddleware.js';

const ideaRouter = Router();

ideaRouter.route('/create').post(userAuthenticate ,createIdea);
ideaRouter.route('/update/:ideaId').put(userAuthenticate ,updateIdea);
ideaRouter.route('/delete/:ideaId').delete(userAuthenticate, deleteIdea);
ideaRouter.route('/public').get(getIdeas);
ideaRouter.route('/author').get(userAuthenticate, getAuthorIdeas);
ideaRouter.route('/suggest').post(suggestBestIdea);

export default ideaRouter;