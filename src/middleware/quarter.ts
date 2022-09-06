import { NextFunction, Request, Response } from "express";
import auth from "./auth";

export default (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  if (userId === "browsing") {
    next();
  } else {
    auth(req, res, next);
  }
};
