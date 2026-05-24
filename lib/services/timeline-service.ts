import type { TimelineEvent } from "@/lib/types/domain";

export function sortTimelineEvents(events: TimelineEvent[]) {
  return [...events].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function detectTimelineGaps(events: TimelineEvent[]) {
  const sortedEvents = sortTimelineEvents(events);

  return sortedEvents
    .map((event, index) => {
      const previous = sortedEvents[index - 1];

      if (!previous || event.dateLabel || previous.dateLabel) {
        return null;
      }

      return {
        eventId: event.id,
        message: `${event.title} and ${previous.title} both need date labels for manual continuity checks.`
      };
    })
    .filter((gap): gap is { eventId: string; message: string } => Boolean(gap));
}
