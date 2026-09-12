import { redirect } from "next/navigation";

export default function HomePage() {
  // Apex/Admin → manda para /admin (que decide login vs dashboard)
  redirect("/admin");
}