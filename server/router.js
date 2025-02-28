import express from 'express'
import controllers from './controller/controller.js'
const router = express.Router()

router.get('/stats/:period', controllers.getStats)
router.post('/stats', controllers.logVisit)
router.delete('/clearall', controllers.clearAll)

export default router;