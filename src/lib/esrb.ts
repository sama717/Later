import type { RawgEsrbRating } from "./rawg";

export function getAgeBadgeLabel(esrb: RawgEsrbRating | null): string {
  if (!esrb) return "N/A";
  switch (esrb.slug) {
    case "everyone": return "E";
    case "everyone-10-plus": return "10+";
    case "teen": return "13+";
    case "mature": return "17+";
    case "adults-only": return "18+";
    default: return "N/A";
  }
}

export function getAgeBadgeClass(esrb: RawgEsrbRating | null): string {
  if (!esrb) return "bg-notrated";
  switch (esrb.slug) {
    case "everyone":
    case "everyone-10-plus":
      return "bg-everyone";
    case "teen":
      return "bg-teen";
    case "mature":
    case "adults-only":
      return "bg-mature";
    default:
      return "bg-notrated";
  }
}