import express from 'express'
import controllers from './controller/controller.js'
const router = express.Router()

router.get('/stats/:period', controllers.getStats)
router.get('/', controllers.testEc2)
router.post('/visits', controllers.logVisit)
router.delete('/clearall', controllers.clearAll)

export default router;