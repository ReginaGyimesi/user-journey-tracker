import { Event } from "../types";

// Helper function to calculate session duration in minutes
export const calculateDuration = (
  startTime: string,
  endTime: string
): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

// Find the most recent SESSION_STARTED event and reverse the list
export const getRecentSessionEvents = (events?: Event[]) => {
  if (!events || events.length === 0) {
    return { recentEvent: null, sessionEvents: [] };
  }

  // Find the most recent SESSION_STARTED event
  const sessionStartedEvents = events.filter(
    (event) => event.event_type === "SESSION_STARTED"
  );

  if (sessionStartedEvents.length === 0) {
    return { recentEvent: null, sessionEvents: [] };
  }

  // Get the most recent SESSION_STARTED event
  const mostRecentSessionStarted = sessionStartedEvents[0];

  // Get all events from this session and reverse them
  const sessionEvents = events
    .filter((event) => event.session_id === mostRecentSessionStarted.session_id)
    .reverse();

  return { recentEvent: mostRecentSessionStarted, sessionEvents };
};
