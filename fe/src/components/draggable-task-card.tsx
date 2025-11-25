import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskDetailModal from "./task-detail-modal";

interface DraggableTaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  task,
  index,
  onDelete,
  onStatusChange,
}) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  return (
    <>
      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={task}
      />
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-3 outline-none"
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.8 : 1,
            }}
            onClick={() => setIsDetailOpen(true)}
          >
            <Card
              className={cn(
                "bg-white hover:shadow-md transition-all group relative",
                snapshot.isDragging ? "shadow-xl ring-2 ring-gray-800/20" : ""
              )}
            >
              <CardHeader className="mb-1 flex flex-row justify-between items-start space-y-0">
                <span className="font-semibold text-md leading-tight pr-6">
                  {task.title}
                </span>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer h-6 w-6"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Tugas?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Tugas "
                        <strong>{task.title}</strong>" akan dihapus permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        Batal
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await onDelete(task.id);
                        }}
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardHeader>

              <CardContent className="mt-1">
                {task.description && (
                  <p className="text-gray-500 text-sm line-clamp-3 mb-2">
                    {task.description}
                  </p>
                )}

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                  <Badge
                    variant="outline"
                    className="text-[12px] font-normal text-gray-600"
                  >
                    {new Date(task.createdAt).toLocaleDateString()}
                  </Badge>

                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      value={task.status}
                      onValueChange={async (val) =>
                        await onStatusChange(task.id, val as TaskStatus)
                      }
                    >
                      <SelectTrigger className="h-6 text-[12px] w-[110px] px-2">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default DraggableTaskCard;
