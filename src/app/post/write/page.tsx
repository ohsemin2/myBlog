import { Header } from "@/widgets/header/ui";
import PostEditorLoader from "@/features/post/write/ui/PostEditorLoader";

export default function WritePage() {
  return (
    <div>
      <Header />
      <main>
        <PostEditorLoader />
      </main>
    </div>
  );
}
