"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Card, CardDescription, CardTitle, Input, Label, Textarea } from "@campusflow/ui";
import type { CreateSessionInput } from "./api";
import { createSessionFormSchema, type CreateSessionFormValues } from "./schemas";

type SessionSchedulerProps = {
  groupId: string;
  onSchedule: (payload: CreateSessionInput) => Promise<void>;
};

export function SessionScheduler({ groupId, onSchedule }: SessionSchedulerProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateSessionFormValues>({
    resolver: zodResolver(createSessionFormSchema),
    defaultValues: {
      groupId,
      topic: "",
      agenda: "",
      scheduledAt: "",
      durationMinutes: 60,
      availability: "",
      addToCalendar: true
    }
  });

  return (
    <Card className="border-white/10 bg-slate-950/80">
      <CardTitle className="text-sm">Schedule session</CardTitle>
      <CardDescription className="mt-1">Set topic, agenda, availability, and a calendar toggle.</CardDescription>
      <form
        className="mt-4 space-y-3"
        onSubmit={handleSubmit(async (values) => {
          await onSchedule(values);
          reset({ ...values, topic: "", agenda: "", availability: "" });
        })}
      >
        <div>
          <Label htmlFor={`topic-${groupId}`}>Topic</Label>
          <Input id={`topic-${groupId}`} placeholder="Greedy algorithms" {...register("topic")} />
        </div>
        <div>
          <Label htmlFor={`agenda-${groupId}`}>Agenda</Label>
          <Textarea id={`agenda-${groupId}`} placeholder="Revise core concept and solve 4 problems" {...register("agenda")} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor={`scheduledAt-${groupId}`}>Scheduled at</Label>
            <Input id={`scheduledAt-${groupId}`} type="datetime-local" {...register("scheduledAt")} />
            {errors.scheduledAt ? <p className="mt-1 text-xs text-rose-400">{errors.scheduledAt.message}</p> : null}
          </div>
          <div>
            <Label htmlFor={`duration-${groupId}`}>Duration (minutes)</Label>
            <Input id={`duration-${groupId}`} type="number" min={15} max={480} {...register("durationMinutes", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <Label htmlFor={`availability-${groupId}`}>Availability / time slot</Label>
          <Input id={`availability-${groupId}`} placeholder="Mon-Fri after 6 PM" {...register("availability")} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" className="h-4 w-4" {...register("addToCalendar")} />
          Add to Google Calendar
        </label>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Scheduling..." : "Schedule session"}
        </Button>
      </form>
    </Card>
  );
}