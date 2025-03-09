import express from 'express';
import controllers from './controller/controller.js';
const router = express.Router();

router.get('/stats/:period', controllers.getStats);
router.post('/visits', controllers.logVisits);
router.delete('/clearall', controllers.clearAll);

export default router;