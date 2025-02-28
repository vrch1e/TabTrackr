import express from 'express'
import { getStats, logVisit, clearAll } from 'controller/controller.js'
const router = express.Router()


router.get('/stats/:period', getStats)
router.post('/stats', logVisit)
router.delete('/clearall', clearAll)

export default router;