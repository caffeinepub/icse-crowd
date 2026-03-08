import { Principal } from "@dfinity/principal";

/**
 * Safely converts a principal text string into a Principal instance.
 * Returns null if the input is invalid or conversion fails.
 */
export function safePrincipalFromText(
  principalText: string | null | undefined,
): Principal | null {
  if (!principalText || typeof principalText !== "string") {
    return null;
  }

  try {
    return Principal.fromText(principalText);
  } catch (error) {
    console.error("Failed to convert principal text:", principalText, error);
    return null;
  }
}
