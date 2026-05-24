import { pool } from "../../db";
import type { IIssuePayload, IIssueQuery, IIssueResponse } from "./issue.interface";


const createIssue = async (payload: IIssuePayload, reporterId: number): Promise<IIssueResponse> => {
    const { title, description, type } = payload;
    const result = await pool.query(
      `INSERT INTO issues (title, description, type, reporter_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, type, reporterId]
    );
    return result.rows[0];
};


const getAllIssues = async (queryParams: IIssueQuery) => {
  const { sort = "newest", type, status } = queryParams;

  let query = `SELECT * FROM issues WHERE 1=1`;
  const values: any[] = [];

  
  if (type) {
    values.push(type);
    query += ` AND type = $${values.length}`;
  }

  
  if (status) {
    values.push(status);
    query += ` AND status = $${values.length}`;
  }

  
  query +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  
  const issuesResult = await pool.query(query, values);
  const issues = issuesResult.rows;

  
  if (!issues.length) {
    return [];
  }

  
  const reporterIds = issues.map((issue) => issue.reporter_id);

  
  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds]
  );

  
  const userMap = new Map();

  usersResult.rows.forEach((user) => {
    userMap.set(user.id, user);
  });


  const finalData = issues.map((issue) => {
      const { reporter_id,created_at,updated_at, ...issueData } = issue; 
      return {
        ...issueData,
        reporter: userMap.get(reporter_id),
        created_at,
        updated_at,
      };
  });

  return finalData;
};





const getSingleIssue = async (id: string) => {
    const issueRes = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

    if (issueRes.rows.length === 0) throw new Error("Issue not found");

    const issue = issueRes.rows[0];

    const userRes = await pool.query(`SELECT id, name, role FROM users WHERE id = $1`, [issue.reporter_id]);
    const reporter = userRes.rows[0];

    const { reporter_id,created_at,updated_at, ...issueData } = issue;
    return { ...issueData, reporter, created_at, updated_at };
};


const updateIssue = async (id: string, payload: Partial<IIssuePayload>, user: any): Promise<IIssueResponse> => {
    const issueRes = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);
    if (issueRes.rows.length === 0) throw new Error("Issue not found");
    const issue = issueRes.rows[0];

    if (user.role === "contributor") {
      if (issue.reporter_id !== user.id) throw new Error("Forbidden: Not your issue");
      if (issue.status !== "open") throw new Error("Conflict: Cannot edit non-open issue");
    }

    const { title, description, type, status } = payload;
    const result = await pool.query(
      `UPDATE issues SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         type = COALESCE($3, type),
         status = COALESCE($4, status),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, description, type, status, id]
    );
    return result.rows[0];
};



const deleteIssue = async (id: string): Promise<boolean> => {
    const result = await pool.query(`DELETE FROM issues WHERE id = $1 RETURNING id`, [id]);
    if (result.rowCount === 0) throw new Error("Issue not found");
    return true;
};


export const issuesService = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
}