type SearchField = number | string | null | undefined;

interface ControlTarget {
  readonly value?: string;
}

export function controlValue(event: Event): string {
  const target = event.target as ControlTarget | null;

  return target?.value ?? '';
}

export function matchesSearch(query: string, fields: readonly SearchField[]): boolean {
  const normalizedQuery = normalize(query);

  return normalizedQuery.length === 0 || fields.some(field => normalize(field).includes(normalizedQuery));
}

export function uniqueStrings(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values)).sort((current, next) => current.localeCompare(next));
}

function normalize(value: SearchField): string {
  return String(value ?? '').trim().toLowerCase();
}
