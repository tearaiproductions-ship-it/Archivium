import type { DashboardSnapshot, LoreEntry, Story, Universe } from "@/lib/types/domain";

const now = new Date().toISOString();

export const demoUniverses: Universe[] = [
  {
    id: "ashfall-universe",
    userId: "demo-user",
    name: "Ashfall Universe",
    description: "A volcanic high-fantasy setting of glass bridges, ash storms, and rival city-states.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "solar-empire",
    userId: "demo-user",
    name: "Solar Empire Setting",
    description: "A science-fiction setting tracking dynastic politics across orbital habitats.",
    createdAt: now,
    updatedAt: now
  }
];

export const demoStories: Story[] = [
  {
    id: "ember-road",
    userId: "demo-user",
    universeId: "ashfall-universe",
    title: "The Ember Road",
    synopsis: "Mara crosses the Black Glass Bridge to uncover who is selling relics to the Ash Court.",
    draftStatus: "drafting",
    wordCount: 12842,
    timelinePosition: "Third Ashfall",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "orbital-heirs",
    userId: "demo-user",
    universeId: "solar-empire",
    title: "Orbital Heirs",
    synopsis: "Two heirs must share a throne neither can legally inherit alone.",
    draftStatus: "planning",
    wordCount: 3180,
    timelinePosition: "Cycle 814",
    createdAt: now,
    updatedAt: now
  }
];

export const demoLoreEntries: LoreEntry[] = [
  {
    id: "mara-vel",
    userId: "demo-user",
    universeId: "ashfall-universe",
    type: "character",
    name: "Mara Vel",
    shortSummary: "Courier and reluctant witness to the Ash Court conspiracy.",
    fullDescription:
      "Mara grew up in the lower city and knows the ash roads better than any sanctioned courier.",
    tags: ["protagonist", "courier"],
    canonStatus: "draft",
    firstMention: {
      storyTitle: "The Ember Road",
      chapterTitle: "Chapter 1: Cinders",
      sceneTitle: "Bridge Crossing",
      excerpt: "Mara crossed the Black Glass Bridge before the bells woke the harbor."
    },
    appearances: [
      {
        storyTitle: "The Ember Road",
        chapterTitle: "Chapter 1: Cinders",
        sceneTitle: "Bridge Crossing"
      }
    ],
    relatedEntryIds: ["black-glass-bridge"],
    notes: "Consider tying her family history to the bridge guild.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "black-glass-bridge",
    userId: "demo-user",
    universeId: "ashfall-universe",
    type: "location",
    name: "Black Glass Bridge",
    shortSummary: "A volcanic glass bridge spanning the old caldera harbor.",
    fullDescription:
      "A ceremonial route used by nobles and smugglers alike. Its underside contains sealed maintenance shrines.",
    tags: ["city", "landmark"],
    canonStatus: "canon",
    firstMention: {
      storyTitle: "The Ember Road",
      chapterTitle: "Chapter 1: Cinders",
      sceneTitle: "Bridge Crossing",
      excerpt: "Mara crossed the Black Glass Bridge before the bells woke the harbor."
    },
    appearances: [
      {
        storyTitle: "The Ember Road",
        chapterTitle: "Chapter 1: Cinders",
        sceneTitle: "Bridge Crossing"
      }
    ],
    relatedEntryIds: ["mara-vel"],
    notes: "Bridge tolls can create plot friction in later chapters.",
    createdAt: now,
    updatedAt: now
  }
];

export const demoDashboardSnapshot: DashboardSnapshot = {
  user: {
    id: "demo-user",
    email: "writer@example.com",
    displayName: "Demo Writer",
    plan: "free"
  },
  universes: demoUniverses,
  stories: demoStories,
  loreEntries: demoLoreEntries,
  continuityIssues: [
    {
      id: "possible-duplicate-bridge",
      severity: "warning",
      title: "Possible duplicate location",
      description: "\"Glass Bridge\" appears in Chapter 2 but is not linked to Black Glass Bridge.",
      relatedEntryId: "black-glass-bridge",
      location: "The Ember Road / Chapter 2"
    },
    {
      id: "unresolved-ash-court",
      severity: "info",
      title: "Unresolved lore mention",
      description: "\"Ash Court\" appears twice without a faction entry.",
      location: "The Ember Road / Chapter 1"
    }
  ]
};
