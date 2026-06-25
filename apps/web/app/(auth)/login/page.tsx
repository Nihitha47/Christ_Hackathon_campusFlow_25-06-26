"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequestSchema, type LoginRequest } from "@campusflow/shared";
import { Button, Card, Input, Label } from "@campusflow/ui";

export default function LoginPage() {
  const [message, setMessage] = React.useState<string>("");
  const { register, handleSubmit } = useForm<LoginRequest>({ resolver: zodResolver(loginRequestSchema) });

  const onSubmit = async (values: LoginRequest) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        setMessage(await response.text());
        return;
      }
      const result = await response.json();
      if (result.data?.session?.accessToken) {
        localStorage.setItem("campusflow-session", JSON.stringify(result.data.session));
        localStorage.setItem("campusflow-active-profile-id", result.data.session.profileId);
      }
      setMessage("Login successful! Redirecting...");
      setTimeout(() => { window.location.href = "/dashboard"; }, 800);
    } catch {
      setMessage("Login failed");
    }
  };

  return (
    <Card className="border-white/10 bg-slate-950/90 p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-300">Welcome back</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Sign in to CampusFlow</h2>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="googleEmail">Google email/account</Label>
          <Input id="googleEmail" type="email" placeholder="you@gmail.com" {...register("googleEmail")} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Your password" {...register("password")} />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </form>
    </Card>
  );
}