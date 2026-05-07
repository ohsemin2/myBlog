import { getCategories } from "@/shared/api/supabase/queries";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const categories = await getCategories();

  return (
    <SidebarClient
      initialCategories={categories}
    />
  );
}
