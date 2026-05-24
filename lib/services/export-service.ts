import type { LoreEntry, Story, Universe } from "@/lib/types/domain";

export function exportStoryMarkdown(story: Story, chapters: Array<{ title: string; scenes: Array<{ title: string; body: string }> }>) {
  const chapterMarkdown = chapters
    .map((chapter) => {
      const scenes = chapter.scenes.map((scene) => `### ${scene.title}\n\n${scene.body}`).join("\n\n");
      return `## ${chapter.title}\n\n${scenes}`;
    })
    .join("\n\n");

  return `# ${story.title}\n\n${story.synopsis}\n\n${chapterMarkdown}`;
}

export function exportUniverseJson(universe: Universe, entries: LoreEntry[]) {
  return JSON.stringify(
    {
      universe,
      exportedAt: new Date().toISOString(),
      entries
    },
    null,
    2
  );
}

export function exportLoreCsv(entries: LoreEntry[]) {
  const header = ["name", "type", "canon_status", "short_summary", "tags"].join(",");
  const rows = entries.map((entry) =>
    [
      entry.name,
      entry.type,
      entry.canonStatus,
      entry.shortSummary,
      entry.tags.join("|")
    ]
      .map(escapeCsvValue)
      .join(",")
  );

  return [header, ...rows].join("\n");
}

function escapeCsvValue(value: string) {
  if (!/[",\n]/.test(value)) {
    return value;
  }

  return `"${value.replaceAll("\"", "\"\"")}"`;
}
