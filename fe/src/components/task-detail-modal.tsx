import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, AlignLeftIcon } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const TaskDetailModal: React.FC<Props> = ({ isOpen, onClose, task }) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Done":
        return "default";
      case "In Progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-4">
            <DialogTitle className="text-2xl font-bold leading-tight wrap-break-words">
              {task.title}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Badge variant={getBadgeVariant(task.status)} className="text-xs">
              {task.status}
            </Badge>
            <div className="flex items-center text-sm text-slate-500">
              <CalendarIcon className="w-3 h-3 mr-1" />
              {new Date(task.createdAt).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-start gap-3">
            <div className="gap-3 flex-row w-full flex">
              <AlignLeftIcon className="w-5 h-5 text-slate-400 mt-0.5" />
              <h4 className="text-md font-medium text-slate-900">Deskripsi</h4>
            </div>
            {task.description ? (
              <div className="text-md w-full text-slate-600 leading-relaxed whitespace-pre-wrap p-3 bg-slate-100 rounded-md border border-slate-200">
                {task.description}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">
                Tidak ada deskripsi lampiran.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
