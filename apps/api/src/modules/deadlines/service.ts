import { getSupabaseAdmin } from "../../core/supabase";
import { AppError } from "../../core/errors";
import { automationService } from "../../services/automation";
import type { TaskRecord, TaskUpsertInput } from "@campusflow/shared";

export class DeadlineService {
  async createTask(profileId: string, input: TaskUpsertInput): Promise<TaskRecord> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        profile_id: profileId,
        title: input.title,
        description: input.description || "",
        subject: input.subject || "",
        due_at: input.dueAt,
        reminder_at: input.reminderAt || null,
        add_to_calendar: input.addToCalendar,
        priority: input.priority,
        completed: false
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new AppError(400, error?.message ?? "Failed to create task");
    }

    // Map database columns to schema
    const task: TaskRecord = {
      id: data.id,
      title: data.title,
      description: data.description,
      subject: data.subject || "",
      dueAt: data.due_at,
      reminderAt: data.reminder_at,
      addToCalendar: data.add_to_calendar,
      priority: data.priority,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    // Emit automation events
    await automationService.queue("DEADLINE_CREATED", "deadlines", task.id, {
      title: task.title,
      dueAt: task.dueAt,
      subject: task.subject,
      priority: task.priority
    });

    if (input.addToCalendar) {
      await automationService.queue("DEADLINE_REMINDER_SCHEDULED", "deadlines", task.id, {
        title: task.title,
        reminderAt: task.reminderAt,
        dueAt: task.dueAt,
        subject: task.subject
      });
    }

    return task;
  }

  async updateTask(profileId: string, taskId: string, input: TaskUpsertInput): Promise<TaskRecord> {
    const supabase = getSupabaseAdmin();

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("profile_id", profileId)
      .single();

    if (fetchError || !existing) {
      throw new AppError(404, "Task not found");
    }

    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: input.title,
        description: input.description || "",
        subject: input.subject || "",
        due_at: input.dueAt,
        reminder_at: input.reminderAt || null,
        add_to_calendar: input.addToCalendar,
        priority: input.priority,
        updated_at: new Date().toISOString()
      })
      .eq("id", taskId)
      .select("*")
      .single();

    if (error || !data) {
      throw new AppError(400, error?.message ?? "Failed to update task");
    }

    const task: TaskRecord = {
      id: data.id,
      title: data.title,
      description: data.description,
      subject: data.subject || "",
      dueAt: data.due_at,
      reminderAt: data.reminder_at,
      addToCalendar: data.add_to_calendar,
      priority: data.priority,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    // Emit automation event for reminder if add_to_calendar changed or reminderAt changed
    if (input.addToCalendar && (!existing.add_to_calendar || existing.reminder_at !== input.reminderAt)) {
      await automationService.queue("DEADLINE_REMINDER_SCHEDULED", "deadlines", task.id, {
        title: task.title,
        reminderAt: task.reminderAt,
        dueAt: task.dueAt,
        subject: task.subject
      });
    }

    return task;
  }

  async getTask(profileId: string, taskId: string): Promise<TaskRecord> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("profile_id", profileId)
      .single();

    if (error || !data) {
      throw new AppError(404, "Task not found");
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      subject: data.subject || "",
      dueAt: data.due_at,
      reminderAt: data.reminder_at,
      addToCalendar: data.add_to_calendar,
      priority: data.priority,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async listTasks(profileId: string, filters?: { subject?: string; completed?: boolean }): Promise<TaskRecord[]> {
    const supabase = getSupabaseAdmin();

    let query = supabase.from("tasks").select("*").eq("profile_id", profileId);

    if (filters?.subject) {
      query = query.eq("subject", filters.subject);
    }

    if (filters?.completed !== undefined) {
      query = query.eq("completed", filters.completed);
    }

    const { data, error } = await query.order("due_at", { ascending: true });

    if (error) {
      throw new AppError(400, error.message);
    }

    return (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      subject: row.subject || "",
      dueAt: row.due_at,
      reminderAt: row.reminder_at,
      addToCalendar: row.add_to_calendar,
      priority: row.priority,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  async deleteTask(profileId: string, taskId: string): Promise<void> {
    const supabase = getSupabaseAdmin();

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("profile_id", profileId)
      .single();

    if (fetchError || !existing) {
      throw new AppError(404, "Task not found");
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      throw new AppError(400, error.message);
    }
  }

  async completeTask(profileId: string, taskId: string): Promise<TaskRecord> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("tasks")
      .update({ completed: true, updated_at: new Date().toISOString() })
      .eq("id", taskId)
      .eq("profile_id", profileId)
      .select("*")
      .single();

    if (error || !data) {
      throw new AppError(404, "Task not found");
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      subject: data.subject || "",
      dueAt: data.due_at,
      reminderAt: data.reminder_at,
      addToCalendar: data.add_to_calendar,
      priority: data.priority,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async getDeadlineStats(profileId: string): Promise<{
    totalTasks: number;
    completed: number;
    dueToday: number;
    overdue: number;
  }> {
    const supabase = getSupabaseAdmin();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("profile_id", profileId);

    if (error) {
      throw new AppError(400, error.message);
    }

    const tasks = data || [];
    const now = new Date();

    return {
      totalTasks: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      dueToday: tasks.filter((t) => {
        const dueDate = new Date(t.due_at);
        return dueDate >= todayStart && dueDate <= todayEnd && !t.completed;
      }).length,
      overdue: tasks.filter((t) => {
        const dueDate = new Date(t.due_at);
        return dueDate < now && !t.completed;
      }).length
    };
  }
}

export const deadlineService = new DeadlineService();
