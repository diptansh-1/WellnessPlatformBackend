const express = require('express');
const {
  getSessions,
  getMySessions,
  getMySession,
  saveDraft,
  publishSession,
  deleteSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');
const { validateSession } = require('../middleware/validation');

const router = express.Router();


router.get('/sessions', getSessions);


router.use(protect);

router.get('/my-sessions', getMySessions);
router.get('/my-sessions/:id', getMySession);
router.post('/my-sessions/save-draft', saveDraft);
router.post('/my-sessions/publish', validateSession, publishSession);
router.delete('/my-sessions/:id', deleteSession);

module.exports = router;
