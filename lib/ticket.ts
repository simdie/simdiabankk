export function generateTicketNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${year}${month}${day}-${rand}`;
}

/** Format a raw ticketId for display in email subjects / UI.
 *  - Already readable (starts with TKT-) → return as-is
 *  - Raw cuid or anything else            → show last 6 chars as short ref
 */
export function formatTicketDisplay(ticketId: string | null | undefined, fallbackId: string): string {
  if (ticketId?.startsWith("TKT-")) return ticketId;
  const id = ticketId ?? fallbackId;
  return `#${id.slice(-6).toUpperCase()}`;
}
