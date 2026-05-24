import { Router } from "express";
import { issuesController } from "./issues.controller";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.post("/", authMiddleware(["contributor", "maintainer"]), issuesController.createIssue);
router.patch("/:id", authMiddleware(["contributor", "maintainer"]), issuesController.updateIssue);
router.delete("/:id", authMiddleware(["maintainer"]), issuesController.deleteIssue);

export const issuesRoute = router;
