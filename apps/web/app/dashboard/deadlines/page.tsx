"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge, Button, Card, CardDescription, CardTitle } from "@campusflow/ui";
import { ChevronDown, Plus } from "lucide-react";
import { apiJson } from "../../../lib/api-client";
import type { TaskRecord } from "@campusflow/shared";
import DeadlineStats from "../../../components/modules/deadlines/deadline-stats";
import DeadlineList from "../../../components/modules/deadlines/deadline-list";
import DeadlineForm from "../../../components/modules/deadlines/deadline-form";
import DeadlineFilters from "../../../components/modules/deadlines/deadline-filters";

export default function DeadlinesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<TaskRecord | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

  const { data: stats = { totalTasks: 0, completed: 0, dueToday: 0, overdue: 0 }, isLoading: statsLoading } = useQuery({
    queryKey: ["deadline-stats"],
    queryFn: () => apiJson<{ totalTasks: number; completed: number; dueToday: number; overdue: number }>("/api/deadlines/stats")
  });

  const { data: tasksData = { tasks: [] }, isLoading: tasksLoading } = useQuery({
    queryKey: ["deadlines", subjectFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (subjectFilter) params.append("subject", subjectFilter);
      if (statusFilter === "pending") params.append("completed", "false");
      if (statusFilter === "completed") params.append("completed", "true");
      return apiJson<{ tasks: TaskRecord[] }>(`/api/deadlines?${params.toString()}`);
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiJson("/api/deadlines", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["deadline-stats"] });
      setIsFormOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiJson(`/api/deadlines/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["deadline-stats"] });
      setIsFormOpen(false);
      setSelectedDeadline(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiJson(`/api/deadlines/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["deadline-stats"] });
    }
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => apiJson(`/api/deadlines/${id}/complete`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      queryClient.invalidateQueries({ queryKey: ["deadline-stats"] });
    }
  });

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedDeadline(null);
  };

  const tasks = tasksData.tasks || [];
  const subjects = [...new Set(tasks.map((t) => t.subject).filter(Boolean))];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="border-blue-400/20 bg-blue-400/10 text-blue-200 mb-2">Smart Deadline Manager</Badge>
          <h1 className="text-3xl font-bold text-white">Deadlines & Tasks</h1>
          <p className="mt-1 text-sm text-slate-400">Stay on top of upcoming deadlines with reminders and calendar sync.</p>
        </div>
        <Button
          onClick={() => {
            setSelectedDeadline(null);
            setIsFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Deadline
        </Button>
      </section>

      {/* Stats */}
      <DeadlineStats stats={stats} loading={statsLoading} />

      {/* Filters */}
      <DeadlineFilters
        subjects={subjects}
        selectedSubject={subjectFilter}
        onSubjectChange={setSubjectFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Main Content - List and Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="lg:col-span-2">
          <DeadlineList
            tasks={tasks}
            loading={tasksLoading}
            onEdit={(task) => {
              setSelectedDeadline(task);
              setIsFormOpen(true);
            }}
            onDelete={(id) => deleteMutation.mutate(id)}
            onComplete={(id) => completeMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
            isCompleting={completeMutation.isPending}
          />
        </div>

        {/* Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            {isFormOpen ? (
              <DeadlineForm
                deadline={selectedDeadline}
                subjects={subjects}
                onSubmit={(data) => {
                  if (selectedDeadline) {
                    updateMutation.mutate({ id: selectedDeadline.id, data });
                  } else {
                    createMutation.mutate(data);
                  }
                }}
                onCancel={handleCloseForm}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            ) : (
              <Card className="border-white/8 bg-slate-950/80 p-6">
                <p className="text-sm text-slate-400">Select a deadline to edit or create a new one</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
