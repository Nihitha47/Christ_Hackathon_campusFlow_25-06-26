"use client";

import { Card, CardDescription } from "@campusflow/ui";
import { AlertCircle, CheckCircle2, Clock, ListTodo } from "lucide-react";

interface DeadlineStatsProps {
  stats: {
    totalTasks: number;
    completed: number;
    dueToday: number;
    overdue: number;
  };
  loading?: boolean;
}

export default function DeadlineStats({ stats, loading }: DeadlineStatsProps) {
  const statCards = [
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      icon: ListTodo,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10"
    },
    {
      label: "Due Today",
      value: stats.dueToday,
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10"
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "text-red-400",
      bgColor: "bg-red-400/10"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="border-white/8 bg-slate-950/80">
            <div className="flex items-start justify-between">
              <div>
                <CardDescription className="text-xs">{card.label}</CardDescription>
                <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
