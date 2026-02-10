import { cache } from "react";
import { createClient } from "./server";

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCategories = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, parent_id")
    .order("name");
  return data ?? [];
});
