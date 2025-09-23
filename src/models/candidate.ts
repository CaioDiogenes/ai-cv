export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  details: string;
}

export interface EducationEntry {
  degree: string;
  institution: string
  period: string;
}

export interface Candidate {
  name: string;
  interestArea: string;
  education: string;
  experience: string;
  skills: string;
  objective: string;
}

export interface CvDecision {
  apto: boolean;
  justificativa: string;
  score?: number;
  band?: string;
  [k: string]: any;
}
