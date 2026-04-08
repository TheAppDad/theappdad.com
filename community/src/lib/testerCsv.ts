/** RFC 4180-style single-column CSV for Play tester emails. */
export function formatTesterCsv(emails: string[]): string {
  const esc = (cell: string) =>
    /[",\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
  const lines = ["email", ...emails.map(esc)];
  return `${lines.join("\r\n")}\r\n`;
}
