import { Router } from "express";
import DataConroller from "../data/DataConroller";

const router: Router = Router();

router.get("/", DataConroller.addCategoryData);

export default router;
