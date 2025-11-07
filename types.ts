
export interface Runner {
  id: string;
  name: string;
  isJoining: boolean;
  miles: number;
}

export interface RunningDay {
  date: string; // ISO date string e.g., "2023-10-27"
  runners: Runner[];
}
   