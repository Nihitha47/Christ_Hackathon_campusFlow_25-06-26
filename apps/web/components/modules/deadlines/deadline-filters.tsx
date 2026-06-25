"use client";

import { Badge } from "@campusflow/ui";
import { X } from "lucide-react";

interface DeadlineFiltersProps {
  subjects: string[];
  selectedSubject: string | null;
  onSubjectChange: (subject: string | null) => void;
  statusFilter: "all" | "pending" | "completed";
  onStatusChange: (status: "all" | "pending" | "completed") => void;
}

export default function DeadlineFilters({
  subjects,
  selectedSubject,
  onSubjectChange,
  statusFilter,
  onStatusChange
}: DeadlineFiltersProps) {
  const statusOptions = [
    { value: "all" as const, label: "All Tasks" },
    { value: "pending" as const, label: "Pending" },
    { value: "completed" as const, label: "Completed" }
  ];

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase">Status:</span>
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`cursor-pointer transition-all ${
              statusFilter === option.value
                ? "bg-blue-500/30 border-blue-400/50 text-blue-200"
                : "bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-800"
            }`}
            variant="outline"
          >
            {option.label}
          </Badge>
        ))}
      </div>

      {/* Subject Filter */}
      {subjects.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Subject:</span>
          {selectedSubject && (
            <Badge className="bg-emerald-500/30 border-emerald-400/50 text-emerald-200 flex items-center gap-1" variant="outline">
              {selectedSubject}
              <button
                onClick={() => onSubjectChange(null)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {!selectedSubject && (
            <>
              <Badge
                onClick={() => onSubjectChange(null)}
                className="cursor-pointer bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-800"
                variant="outline"
              >
                All
              </Badge>
              {subjects.map((subject) => (
                <Badge
                  key={subject}
                  onClick={() => onSubjectChange(subject)}
                  className="cursor-pointer bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-700"
                  variant="outline"
                >
                  {subject}
                </Badge>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
