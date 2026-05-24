import type { LoreEntryType } from "@/lib/types/domain";

export const loreEntryTypes: Array<{
  value: LoreEntryType;
  label: string;
  description: string;
}> = [
  { value: "character", label: "Character", description: "People, protagonists, rivals, and named figures." },
  { value: "location", label: "Location", description: "Places, cities, landmarks, planets, and regions." },
  { value: "faction", label: "Faction", description: "Guilds, houses, nations, institutions, and groups." },
  { value: "species", label: "Species/Race", description: "Cultures, species, ancestries, or created peoples." },
  { value: "item", label: "Item/Artefact", description: "Objects, relics, weapons, texts, and important props." },
  { value: "system", label: "Magic/Technology", description: "Rules, powers, sciences, rituals, and constraints." },
  { value: "event", label: "Event", description: "Wars, births, deaths, disasters, and historical moments." },
  { value: "term", label: "Term/Glossary", description: "Language, concepts, titles, slang, and definitions." },
  { value: "note", label: "Note", description: "Flexible research notes and unstructured worldbuilding." }
];

export function getLoreEntryTypeLabel(type: LoreEntryType) {
  return loreEntryTypes.find((entryType) => entryType.value === type)?.label ?? type;
}
