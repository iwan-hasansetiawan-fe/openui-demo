/**
 * app/page.tsx
 * Redirect ke /chat
 */

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/chat");
}
