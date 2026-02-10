import { getUser, getCategories } from "@/shared/api/supabase/queries";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const [user, categories] = await Promise.all([getUser(), getCategories()]);

  return (
    <SidebarClient
      initialCategories={categories}
      isLoggedIn={!!user}
    />
  );
}
