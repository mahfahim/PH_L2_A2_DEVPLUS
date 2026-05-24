import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import { sendResponse } from "../../utils/sendResponse";
import type { IIssueResponse, IPopulatedIssueResponse } from "./issue.interface";

const createIssue = async (req: Request, res: Response) => {
  try {
    console.log("hi heloo");
    const userId = req.user?.id;
    console.log(`userId ${userId}`);
    if (!userId) {
      return sendResponse(res, 401, {
        success: false,
        message: "Unauthorized",
      });
    }

    const issue = await issuesService.createIssue(req.body, userId);

    return sendResponse<IIssueResponse>(res, 201, {
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error: unknown) { 
    const errorMessage = error instanceof Error ? error.message : "Failed to create issue";
    return sendResponse(res, 400, {
      success: false,
      message: "Failed to create issue",
      errors: errorMessage,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const issues = await issuesService.getAllIssues(req.query as any);

    return sendResponse<IPopulatedIssueResponse[]>(res, 200, {
      success: true,
      data: issues,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch issues";
    return sendResponse(res, 500, {
      success: false,
      message: "Failed to fetch issues",
      errors: errorMessage,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    console.log(id);

    if (!id) {
      return sendResponse(res, 400, {
        success: false,
        message: "Issue id is required",
      });
    }

    const issue = await issuesService.getSingleIssue(id);

    return sendResponse<IPopulatedIssueResponse[]>(res, 200, {
      success: true,
      data: issue,
    });
  } catch (error: unknown) { 
    const errorMessage = error instanceof Error ? error.message : "Issue not found";
    return sendResponse(res, 404, {
      success: false,
      message: "Issue not found",
      errors: errorMessage,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return sendResponse(res, 400, {
        success: false,
        message: "Issue id is required",
      });
    }

    const issue = await issuesService.updateIssue(
      id,
      req.body,
      req.user
    );

    return sendResponse<IIssueResponse>(res, 200, {
      success: true,
      message: "Issue updated successfully",
      data: issue,
    });
  } catch (error: unknown) { 
    const errorMessage = error instanceof Error ? error.message : "";
    
    const code = errorMessage.includes("Forbidden")
      ? 403
      : errorMessage.includes("Conflict")
      ? 409
      : 400;

    return sendResponse(res, code, {
      success: false,
      message: "Update failed",
      errors: errorMessage || "An unexpected error occurred",
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return sendResponse(res, 400, {
        success: false,
        message: "Issue id is required",
      });
    }

    await issuesService.deleteIssue(id);

    return sendResponse(res, 200, {
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: unknown) { 
    const errorMessage = error instanceof Error ? error.message : "Deletion failed";
    return sendResponse(res, 404, {
      success: false,
      message: "Deletion failed",
      errors: errorMessage,
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};