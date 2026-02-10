import { notFound, redirect } from "next/navigation";
import { Header } from "@/widgets/header/ui";
import { createClient } from "@/shared/api/supabase/server";
import PostEditEditorLoader from "@/features/post/write/ui/PostEditEditorLoader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: post } = await supabase
    .from("post")
    .select("id, title, content, category, is_draft")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div>
      <Header />
      <main>
        <PostEditEditorLoader
          id={post.id}
          initialTitle={post.title}
          initialContent={post.content}
          initialCategoryId={post.category ?? null}
          isDraft={post.is_draft ?? false}
        />
      </main>
    </div>
  );
}
