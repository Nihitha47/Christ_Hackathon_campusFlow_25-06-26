"use client";

import { Card, Badge, Button } from "@campusflow/ui";
import { Trash2, Edit2, CheckCircle2, Circle } from "lucide-react";
import type { TaskRecord } from "@campusflow/shared";

interface DeadlineListProps {
  tasks: TaskRecord[];
  loading?: boolean;
  onEdit: (task: TaskRecord) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  isDeleting?: boolean;
  isCompleting?: boolean;
}

export default function DeadlineList({
  tasks,
  loading,
  onEdit,
  onDelete,
  onComplete,
  isDeleting,
  isCompleting
}: DeadlineListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-200 border-red-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-200 border-amber-500/30";
      case "low":
        return "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";
      default:
        return "bg-slate-500/20 text-slate-200 border-slate-500/30";
    }
  };

  const getStatusColor = (completed: boolean) => {
    return completed ? "text-slate-400" : "text-slate-100";
  };

  const isOverdue = (dueAt: string) => {
    return new Date(dueAt) < new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <Card className="border-white/8 bg-slate-950/80">
        <div className="space-y-3 p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-white/8 bg-slate-950/80 p-6 text-center">
        <p className="text-sm text-slate-400">No deadlines yet. Create one to get started.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className={`border-white/8 bg-slate-950/80 overflow-hidden transition-all ${
          task.completed ? "opacity-60" : ""
        } ${isOverdue(task.dueAt) && !task.completed ? "border-red-500/30 bg-red-950/20" : ""}`}>
          <div className="flex items-start justify-between gap-4 p-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <button
                onClick={() => onComplete(task.id)}
                className={`mt-1 flex-shrink-0 transition-colors ${
                  task.completed ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
                }`}
                disabled={isCompleting}
              >
                {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </button>
              <div className="min-w-0 flex-1">
                <h3 className={`font-semibold truncate ${getStatusColor(task.completed)}`}>{task.title}</h3>
                {task.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  {task.subject && (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                      {task.subject}
                    </Badge>
                  )}
                  {task.addToCalendar && (
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-500/30 text-xs">
                      Calendar
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 mt-2 text-xs text-slate-400">
                  <span>Due: {formatDate(task.dueAt)}</span>
                  <span>Reminder: {formatDate(task.reminderAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => onEdit(task)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => onDelete(task.id)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
