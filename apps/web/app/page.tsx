import { redirect } from "next/navigation";
import { routePaths } from "@campusflow/shared";

export default function HomePage() {
  redirect(routePaths.register);
}