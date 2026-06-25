"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskUpsertSchema, type TaskUpsertInput } from "@campusflow/shared";
import { Card, Button, Input, Label, Textarea } from "@campusflow/ui";
import { X } from "lucide-react";
import type { TaskRecord } from "@campusflow/shared";

interface DeadlineFormProps {
  deadline?: TaskRecord | null;
  subjects: string[];
  onSubmit: (data: TaskUpsertInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeadlineForm({
  deadline,
  subjects,
  onSubmit,
  onCancel,
  isLoading
}: DeadlineFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<TaskUpsertInput>({
    resolver: zodResolver(taskUpsertSchema),
    defaultValues: deadline
      ? {
          title: deadline.title,
          description: deadline.description,
          subject: deadline.subject,
          priority: deadline.priority,
          dueAt: deadline.dueAt.slice(0, 16), // Convert ISO to datetime-local format
          reminderAt: deadline.reminderAt.slice(0, 16),
          addToCalendar: deadline.addToCalendar
        }
      : {
          title: "",
          description: "",
          subject: "",
          priority: "medium",
          dueAt: "",
          reminderAt: "",
          addToCalendar: false
        }
  });

  const addToCalendar = watch("addToCalendar");

  return (
    <Card className="border-white/8 bg-slate-950/80 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">
            {deadline ? "Edit Deadline" : "New Deadline"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-semibold">
            Title *
          </Label>
          <Input
            id="title"
            placeholder="Deadline title"
            {...register("title")}
            className={errors.title ? "border-red-500/50" : ""}
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-semibold">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Add notes..."
            {...register("description")}
            className="resize-none"
            rows={3}
          />
          {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-xs font-semibold">
            Subject
          </Label>
          <select
            id="subject"
            {...register("subject")}
            className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="">-- Select or type --</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {errors.subject && <p className="text-xs text-red-400">{errors.subject.message}</p>}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-xs font-semibold">
            Priority *
          </Label>
          <select
            id="priority"
            {...register("priority")}
            className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="text-xs text-red-400">{errors.priority.message}</p>}
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueAt" className="text-xs font-semibold">
            Due Date *
          </Label>
          <Input
            id="dueAt"
            type="datetime-local"
            {...register("dueAt")}
            className={errors.dueAt ? "border-red-500/50" : ""}
          />
          {errors.dueAt && <p className="text-xs text-red-400">{errors.dueAt.message}</p>}
        </div>

        {/* Calendar Toggle and Reminder */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              id="addToCalendar"
              type="checkbox"
              {...register("addToCalendar")}
              className="w-4 h-4 rounded border-white/20 bg-slate-800/50 text-blue-500 focus:ring-blue-500/40"
            />
            <Label htmlFor="addToCalendar" className="text-xs font-semibold cursor-pointer">
              Add to calendar
            </Label>
          </div>

          {addToCalendar && (
            <div>
              <Label htmlFor="reminderAt" className="text-xs font-semibold block mb-2">
                Reminder Time *
              </Label>
              <Input
                id="reminderAt"
                type="datetime-local"
                {...register("reminderAt")}
                className={errors.reminderAt ? "border-red-500/50" : ""}
              />
              {errors.reminderAt && <p className="text-xs text-red-400">{errors.reminderAt.message}</p>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "Saving..." : deadline ? "Update" : "Create"}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
