import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import client from "@/api/client";
import DraggableTaskCard from "./draggable-task-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface KanbanBoardProps {
  initialTasks: GroupedTasks;
  refreshTasks: () => Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialTasks,
  refreshTasks,
}) => {
  const [tasks, setTasks] = useState<GroupedTasks>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDelete = async (id: string) => {
    try {
      await client.delete(`/tasks/${id}`);
      await refreshTasks();
      toast.success("Berhasil menghapus task");
    } catch (err) {
      toast.error("Gagal menghapus task");
      console.error(err);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceColId = source.droppableId as TaskStatus;
    const destColId = destination.droppableId as TaskStatus;

    const newTasks = { ...tasks };
    const sourceList = [...newTasks[sourceColId]];
    const destList =
      sourceColId === destColId ? sourceList : [...newTasks[destColId]];

    const [movedTask] = sourceList.splice(source.index, 1);

    if (sourceColId !== destColId) {
      movedTask.status = destColId;
    }

    destList.splice(destination.index, 0, movedTask);

    newTasks[sourceColId] = sourceList;
    newTasks[destColId] = destList;

    setTasks(newTasks);

    if (sourceColId !== destColId) {
      try {
        await client.put(`/tasks/${draggableId}`, { status: destColId });
      } catch (err) {
        setTasks(initialTasks);
        toast.error("Gagal menyimpan perubahan ke server!");
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const newTasks = { ...tasks };
    let foundTask: Task | undefined;
    let sourceCol: TaskStatus | undefined;

    Object.keys(newTasks).forEach((key) => {
      const k = key as TaskStatus;
      const tIndex = newTasks[k].findIndex((t) => t.id === id);
      if (tIndex !== -1) {
        sourceCol = k;
        [foundTask] = newTasks[k].splice(tIndex, 1);
      }
    });

    if (foundTask && sourceCol) {
      foundTask.status = newStatus;
      newTasks[newStatus].push(foundTask);
      setTasks(newTasks);

      try {
        await client.put(`/tasks/${id}`, { status: newStatus });
        toast.success("Status diperbarui");
      } catch (err) {
        toast.error("Gagal update status");
        refreshTasks();
        console.error(err);
      }
    }
  };

  const columns: TaskStatus[] = ["To Do", "In Progress", "Done"];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map((colId) => (
          <div
            key={colId}
            className="flex flex-col h-full bg-slate-200/50 rounded-xl border border-slate-300/60"
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700 text-sm tracking-wide">
                {colId}
              </h2>
              <Badge
                variant="secondary"
                className="bg-white shadow-sm font-mono text-xs"
              >
                {tasks[colId]?.length || 0}
              </Badge>
            </div>

            <Droppable droppableId={colId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "flex-1 p-3 transition-colors min-h-[150px]",
                    snapshot.isDraggingOver ? "bg-blue-200/40" : ""
                  )}
                >
                  {tasks[colId]?.map((task, index) => (
                    <DraggableTaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
