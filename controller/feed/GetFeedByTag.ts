import { getFeedWrapper } from "./GetFeedWrapper.js";
import { Request, Response } from 'express';


export const getFeedByTags = async (req: Request, res: Response) => {
  const { tag } = req.body;
  const filter = { tags: { $in: [tag] } };
  getFeedWrapper(req, res, filter);
};