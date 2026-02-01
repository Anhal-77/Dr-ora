
export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DentalTriageData {
  painLevel: number;
  sensitivity: string[];
  swelling: boolean;
  bleeding: boolean;
  duration: string;
}
