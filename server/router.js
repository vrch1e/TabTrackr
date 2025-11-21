import express from 'express'
import controllers from './controller/controller.js'
const router = express.Router()

router.get('/firstentry/:userId', controllers.getFirstEntry)
router.get('/stats/:period/:userId', controllers.getStats)
router.get('/testec2', controllers.testEc2)
router.post('/visits', controllers.logVisit)
router.post('/session/create', controllers.createSession)
router.delete('/clearall', controllers.clearAll)

export default router;