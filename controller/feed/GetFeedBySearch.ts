import { getFeedWrapper } from "./GetFeedWrapper.js";
import { Request, Response } from 'express';

export const getFeedBySearch = async (req: Request, res: Response) => {
  const { search } = req.body;
  const filter = { prompt: { $regex: search.split(' ').join('.*'), $options: 'i' } };
  getFeedWrapper(req, res, filter);
};