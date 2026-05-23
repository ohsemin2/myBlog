import { redirect } from "next/navigation";
import { Header } from "@/widgets/header/ui";
import { getCategories, getUser } from "@/shared/api/supabase/queries";
import PostEditorLoader from "@/features/post/write/ui/PostEditorLoader";

export default async function WritePage() {
  const [user, categories] = await Promise.all([getUser(), getCategories()]);
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <Header />
      <main>
        <PostEditorLoader initialCategories={categories} />
      </main>
    </div>
  );
}
