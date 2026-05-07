import { redirect } from "next/navigation";
import { Header } from "@/widgets/header/ui";
import { getUser } from "@/shared/api/supabase/queries";
import PostEditorLoader from "@/features/post/write/ui/PostEditorLoader";

export default async function WritePage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <Header />
      <main>
        <PostEditorLoader />
      </main>
    </div>
  );
}
