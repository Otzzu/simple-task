import { useCallback, useEffect, useState } from "react";
import client from "@/api/client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import KanbanBoard from "./components/kanban-board";
import CreateTaskModal from "./components/create-task-modal";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { AxiosError } from "axios";

function App() {
  const [tasks, setTasks] = useState<GroupedTasks>({
    "To Do": [],
    "In Progress": [],
    Done: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await client.get<ApiResponse<GroupedTasks>>("/tasks", {
        signal,
      });
      setTasks(response.data.data);
    } catch (err) {
      if (err instanceof AxiosError && err.name === "CanceledError") {
        console.log("Request canceled");
        return;
      }
      console.error(err);
      toast.error("Something went wrong!!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchTasks(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchTasks]);

  const handleCreateTask = async (
    title: string,
    description: string
  ): Promise<{
    data?: Task;
    message: string;
    details?: Record<string, string>;
    isError: boolean;
  }> => {
    try {
      const data = await client.post<ApiResponse<Task>>("/tasks", {
        title,
        description,
      });
      await fetchTasks();
      toast.success("Berhasil membuat task");
      return { ...data.data, isError: false };
    } catch (err: unknown) {
      toast.error("Gagal membuat task");
      console.error(err);
      if (err instanceof AxiosError) {
        const data = (err.response?.data as ApiErrorResponse) || null;
        return { ...data, isError: true };
      } else {
        return {
          message: "Something went wrong",
          isError: true,
        };
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 overflow-y-auto">
      <Toaster position="top-right" richColors />
      <div className="max-w-[1400px] w-full mx-auto h-full flex flex-col">
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Task Board
            </h1>
            <p className="text-slate-500 text-sm">Manage tasks</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Task
          </Button>
        </header>

        <main className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">
              Loading board...
            </div>
          ) : (
            <KanbanBoard initialTasks={tasks} refreshTasks={fetchTasks} />
          )}
        </main>

        <CreateTaskModal
          key={isModalOpen ? "open" : "closed"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      </div>
    </div>
  );
}

export default App;
