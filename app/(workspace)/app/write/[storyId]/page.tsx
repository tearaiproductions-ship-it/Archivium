import { WriteStoryPage } from "@/components/writing/write-story-page";

export default function WritePage({ params }: { params: Promise<{ storyId: string }> }) {
  return <WriteStoryPage params={params} />;
}
