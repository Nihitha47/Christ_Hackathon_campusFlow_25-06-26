"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Card, CardDescription, CardTitle, Input, Label, Textarea } from "@campusflow/ui";
import type { CreateGroupInput } from "./api";
import { createGroupFormSchema, type CreateGroupFormValues } from "./schemas";

type CreateGroupFormProps = {
  onSubmitGroup: (payload: CreateGroupInput) => Promise<void>;
};

export function CreateGroupForm({ onSubmitGroup }: CreateGroupFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      ownerProfileId: "",
      name: "",
      subject: "",
      branch: "",
      year: 2,
      description: ""
    }
  });

  return (
    <Card className="border-white/10 bg-slate-950/85">
      <CardTitle>Create study group</CardTitle>
      <CardDescription className="mt-1">Build a focused group and start scheduling sessions instantly.</CardDescription>
      <form
        className="mt-5 space-y-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmitGroup(values);
          reset({ ...values, name: "", subject: "", description: "" });
        })}
      >
        <div>
          <Label htmlFor="ownerProfileId">Owner profile ID</Label>
          <Input id="ownerProfileId" placeholder="UUID of owner profile" {...register("ownerProfileId")} />
          {errors.ownerProfileId ? <p className="mt-1 text-xs text-rose-400">{errors.ownerProfileId.message}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Group name</Label>
            <Input id="name" placeholder="Operating Systems Circle" {...register("name")} />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Operating Systems" {...register("subject")} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input id="branch" placeholder="CSE" {...register("branch")} />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" min={1} max={4} {...register("year", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="What this group is solving together" {...register("description")} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create group"}
        </Button>
      </form>
    </Card>
  );
}