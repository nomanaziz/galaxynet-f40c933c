export interface CoverageLocation {
  id: string;
  name: string;
  name_bn: string | null;
  type: "division" | "district" | "thana" | "zone";
  parent_id: string | null;
  sort_order: number;
  enabled: boolean;
}

export interface CoverageArea {
  id: string;
  name: string;
  name_bn: string | null;
  zone: string | null;
  district: string | null;
  available: boolean;
  location_id: string | null;
}

export function buildLocationMap(locations: CoverageLocation[]): Map<string, CoverageLocation> {
  const m = new Map<string, CoverageLocation>();
  locations.forEach(l => m.set(l.id, l));
  return m;
}

/** Check if a location or any of its ancestors is disabled */
export function isAncestorDisabled(locId: string, locationMap: Map<string, CoverageLocation>): boolean {
  const loc = locationMap.get(locId);
  if (!loc) return false;
  if (!loc.enabled) return true;
  if (loc.parent_id) return isAncestorDisabled(loc.parent_id, locationMap);
  return false;
}

/** Build a set of all location IDs that are effectively disabled (self or ancestor) */
export function buildDisabledLocationIds(locations: CoverageLocation[], locationMap: Map<string, CoverageLocation>): Set<string> {
  const disabled = new Set<string>();
  locations.forEach(l => {
    if (!l.enabled || isAncestorDisabled(l.id, locationMap)) disabled.add(l.id);
  });
  return disabled;
}

/** Get the breadcrumb path for a location */
export function getLocationBreadcrumb(
  locationId: string | null,
  locationMap: Map<string, CoverageLocation>,
  translate?: (en: string, bn: string) => string
): string {
  if (!locationId) return "";
  const parts: string[] = [];
  let current = locationMap.get(locationId);
  while (current) {
    parts.unshift(translate ? translate(current.name, current.name_bn || current.name) : current.name);
    current = current.parent_id ? locationMap.get(current.parent_id) : undefined;
  }
  return parts.join(" > ");
}

/** Find which ancestor is disabled (returns the type label, e.g. "Division", "District") */
export function getDisabledAncestorType(locId: string, locationMap: Map<string, CoverageLocation>): string | null {
  const loc = locationMap.get(locId);
  if (!loc) return null;
  if (!loc.enabled) return loc.type.charAt(0).toUpperCase() + loc.type.slice(1);
  if (loc.parent_id) return getDisabledAncestorType(loc.parent_id, locationMap);
  return null;
}

/** Check if an area is effectively visible (available + hierarchy enabled) */
export function isAreaEffectivelyVisible(area: CoverageArea, disabledLocationIds: Set<string>): boolean {
  if (!area.available) return false;
  if (area.location_id && disabledLocationIds.has(area.location_id)) return false;
  return true;
}

/** Get all descendant IDs of a location */
export function getDescendantIds(parentId: string, locations: CoverageLocation[], targetType?: string): string[] {
  const children = locations.filter(l => l.parent_id === parentId);
  let ids: string[] = [];
  for (const child of children) {
    if (!targetType || child.type === targetType) ids.push(child.id);
    ids = ids.concat(getDescendantIds(child.id, locations, targetType));
  }
  return ids;
}
