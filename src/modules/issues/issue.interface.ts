// src/modules/issues/issue.interface.ts
export type IssueType = 'bug' | 'feature_request';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface IIssuePayload {
  title: string;
  description: string;
  type: IssueType;
  status?: IssueStatus;
}

export interface IIssueQuery {
  sort?: 'newest' | 'oldest';
  type?: IssueType;
  status?: IssueStatus;
}

export interface IIssueResponse extends IIssuePayload {
  id: number;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}


export interface IReporter {
  id: number;
  name: string;
  role: string;
}

export interface IPopulatedIssueResponse extends Omit<IIssueResponse, 'reporter_id'> {
  reporter: IReporter;
}