import {Router} from 'express';
import authorize from '../middleware/auth.middleware.js';
import { createSubscription } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({ title: 'GET all subscriptions' }));


subscriptionRouter.get('/subscribe', (req, res) => res.send({title: 'GET all subscriptions' }));


subscriptionRouter.get('/:id', (req, res) => res.send({title: 'GET subscription details' }));


subscriptionRouter.post('/', authorize, createSubscription);


subscriptionRouter.put('/:id', (req, res) => res.send({title: 'UPDTATE subscription' }));


subscriptionRouter.delete('/:id', (req, res) => res.send({title: 'DELETE subscriptions' }));


subscriptionRouter.get('/user/:id', (req, res) => res.send({title: 'GET all  user subscriptions' }));


subscriptionRouter.put('/:id/cancel', (req, res) => res.send({title: 'CANCEL subscriptions' }));


subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({title: 'GET upcoming renewals' }));


export default subscriptionRouter;