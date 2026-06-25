"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { StudyGroupMemberRecord } from "@campusflow/shared";
import { Badge, Button, Card, CardDescription, CardTitle, Input, Label } from "@campusflow/ui";
import { addMemberFormSchema, type AddMemberFormValues } from "./schemas";

type MemberListProps = {
  groupId: string;
  members: StudyGroupMemberRecord[];
  onAddMember: (groupId: string, values: AddMemberFormValues) => Promise<void>;
};

export function MemberList({ groupId, members, onAddMember }: MemberListProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      profileId: "",
      role: "member"
    }
  });

  return (
    <Card className="border-white/10 bg-slate-950/80">
      <CardTitle className="text-sm">Members</CardTitle>
      <CardDescription className="mt-1">Add students by profile UUID.</CardDescription>
      <div className="mt-4 flex flex-wrap gap-2">
        {members.length === 0 ? <p className="text-xs text-slate-500">No members yet.</p> : null}
        {members.map((member) => (
          <Badge key={member.id} className="border-slate-700 bg-slate-900 text-slate-200">
            {member.profileId.slice(0, 8)}... ({member.role})
          </Badge>
        ))}
      </div>
      <form
        className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]"
        onSubmit={handleSubmit(async (values) => {
          await onAddMember(groupId, values);
          reset({ profileId: "", role: values.role });
        })}
      >
        <div>
          <Label htmlFor={`profileId-${groupId}`}>Profile ID</Label>
          <Input id={`profileId-${groupId}`} placeholder="Member profile UUID" {...register("profileId")} />
          {errors.profileId ? <p className="mt-1 text-xs text-rose-400">{errors.profileId.message}</p> : null}
        </div>
        <div>
          <Label htmlFor={`role-${groupId}`}>Role</Label>
          <select
            id={`role-${groupId}`}
            className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
            {...register("role")}
          >
            <option value="member">Member</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <Button type="submit" className="mt-7" disabled={isSubmitting}>
          Add
        </Button>
      </form>
    </Card>
  );
}