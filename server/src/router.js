import express from 'express';
import controllers from './controller/controller.js';
const router = express.Router();

router.post('/visits', controllers.logVisits);
router.get('/stats/:period', controllers.getStats);
router.delete('/clearall', controllers.clearAll);

export default router;