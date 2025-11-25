type TaskStatus = "To Do" | "In Progress" | "Done";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

interface GroupedTasks {
  "To Do": Task[];
  "In Progress": Task[];
  Done: Task[];
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface ApiErrorResponse {
  message: string;
  details?: Record<string, string>;
}
