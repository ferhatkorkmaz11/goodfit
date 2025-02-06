export interface CheckJobCompatabilityRequest {
  job: Job;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: JobType;
}
export enum JobType {
  LINKEDIN = "linkedin",
  INDEED = "indeed",
  OTHER = "other",
}
