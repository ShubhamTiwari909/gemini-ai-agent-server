import { getFeedWrapper } from "./GetFeedWrapper.js";
import { Request, Response } from 'express';

export const getFeed = async (req: Request, res: Response) => {
  getFeedWrapper(req, res, {});
};