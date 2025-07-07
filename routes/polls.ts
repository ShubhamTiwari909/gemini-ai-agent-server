import express, { Router, Request, Response, NextFunction } from 'express';
import { dynamicLimiter } from '../middlewares/rate-limiting.js';
import { createPoll } from '../controller/polls/Create.js';
import { getPolls } from '../controller/polls/GetPolls.js';
import { updatePollVotes } from '../controller/polls/UpdatePolls.js';

const router: Router = express.Router();

router.post(
  '/create',
  dynamicLimiter(60),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createPoll(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', dynamicLimiter(60), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getPolls(req, res);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/update/votes',
  dynamicLimiter(60),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updatePollVotes(req, res);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
