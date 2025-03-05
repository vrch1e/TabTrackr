import express from 'express'
import controllers from './controller/controller.js'
const router = express.Router()

router.get('/stats/:period', controllers.getStats)
router.get('/watchlist', controllers.getWatchlist)
router.post('/visits', controllers.logVisit)
router.delete('/clearall', controllers.clearAll)

export default router;