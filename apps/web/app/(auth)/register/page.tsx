"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { onboardingSchema, registerRequestSchema, type OnboardingInput, type RegisterRequest } from "@campusflow/shared";
import { Button, Card, Input, Label, Textarea } from "@campusflow/ui";
import { splitSubjects } from "../../../lib/utils";

<<<<<<< HEAD
const registerFormSchema = onboardingSchema.omit({ subjects: true }).extend({
=======
const registerFormSchema = onboardingSchema.extend({
>>>>>>> 3d549590b8362e89faeb9c442c35a3d2fc36de6a
  password: z.string().min(8).max(128),
  subjectsText: z.string().min(2)
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", branch: "", year: 1, subjects: [], subjectsText: "", phoneNumber: "", googleEmail: "", password: "" }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setStatus("submitting");
    try {
      const payload: RegisterRequest = registerRequestSchema.parse({
        name: values.name,
        branch: values.branch,
        year: values.year,
        subjects: splitSubjects(values.subjectsText),
        phoneNumber: values.phoneNumber,
        googleEmail: values.googleEmail,
        password: values.password
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
<<<<<<< HEAD

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const result = await response.json();
      // Save session so all future API calls are authenticated
      if (result.data?.session?.accessToken) {
        localStorage.setItem("campusflow-session", JSON.stringify(result.data.session));
        localStorage.setItem("campusflow-active-profile-id", result.data.session.profileId);
      }

      setStatus("success");
      // Redirect to dashboard after short delay
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    } catch (err: unknown) {
      console.error("Registration error:", err);
=======
      if (!response.ok) throw new Error(await response.text());
      setStatus("success");
    } catch {
>>>>>>> 3d549590b8362e89faeb9c442c35a3d2fc36de6a
      setStatus("error");
    }
  };

  return (
    <Card className="border-white/10 bg-slate-950/90 p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-300">Student onboarding</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Create your CampusFlow profile</h2>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Aarav Mehta" {...register("name")} />
          {errors.name ? <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="branch">Branch</Label>
            <Input id="branch" placeholder="CSE / ECE / IT" {...register("branch")} />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" min={1} max={4} {...register("year", { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <Label htmlFor="subjects">Subjects</Label>
          <Textarea
            id="subjects"
            placeholder="DSA, DBMS, CN"
            {...register("subjectsText")}
          />
          <p className="mt-1 text-xs text-slate-500">Preview: {watch("subjectsText") ? splitSubjects(watch("subjectsText")).join(", ") : "Add comma-separated subjects"}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phoneNumber">Phone number</Label>
            <Input id="phoneNumber" placeholder="+91 98765 43210" {...register("phoneNumber")} />
          </div>
          <div>
            <Label htmlFor="googleEmail">Google email/account</Label>
            <Input id="googleEmail" type="email" placeholder="you@gmail.com" {...register("googleEmail")} />
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Create a strong password" {...register("password")} />
        </div>
        <Button type="submit" className="w-full">
          {status === "submitting" ? "Creating account..." : "Create profile"}
        </Button>
        {status === "success" ? <p className="text-sm text-emerald-300">Profile created. Move to dashboard.</p> : null}
        {status === "error" ? <p className="text-sm text-rose-400">Registration failed. Check the API connection.</p> : null}
      </form>
    </Card>
  );
}