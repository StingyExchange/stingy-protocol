// GATE WARNING (STANDING RULE 3): never blanket-reject a 0x hex string.
// This only checks shape (0x + 40 hex chars). It does not enforce EIP-55
// checksum casing, because a valid, correctly-typed address can legally
// arrive all-lowercase, all-uppercase, or mixed-case.
const ADDRESS_SHAPE = /^0x[0-9a-fA-F]{40}$/;

export function isWellFormedAddress(value: string | null | undefined): boolean {
  if (!value) return false;
  return ADDRESS_SHAPE.test(value);
}
