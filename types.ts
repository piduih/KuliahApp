
export interface Lecture {
  id: string;
  topic: string;
  speaker: string;
  speakerImage?: string | null; // Optional: To store speaker image as base64 string
  location: string;
  latitude?: number;
  longitude?: number;
  date: string; // Stored as YYYY-MM-DD
  time: string; // Stored as HH:MM
  parentId?: string | null; // To group recurring lectures
  reminder?: number | null; // Reminder in minutes before the lecture
}

export interface RecurrenceRule {
    frequency: 'weekly' | 'monthly';
    endDate: string;
}