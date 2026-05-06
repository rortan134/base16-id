import { adjectives, nouns } from "./words";

const NUMERIC_RANGE = 10000;
const MAX_NUMERIC = NUMERIC_RANGE - 1;
const NOUN_RANGE = nouns.length * NUMERIC_RANGE;
const MAX_ID = adjectives.length * nouns.length * MAX_NUMERIC;

function padNumeric(n: number): string {
    return String(n).padStart(4, "0");
}

/**
 * Convert a hexadecimal key into a human-readable ID (HRUID).
 *
 * The resulting string follows the format `adjective-noun-0000`, which is easier
 * to read, spell, and remember than a raw hex value. This is useful for
 * exposing internal identifiers to users (e.g., in URLs, support tickets, or
 * device pairing codes) without sacrificing the ability to recover the original
 * key.
 *
 * @param key - A hexadecimal string representing the numeric key. Must parse to
 *   an integer less than or equal to `1010 * 2876 * 9999` (~29 billion).
 * @returns A human-readable ID in the form `adjective-noun-NNNN`.
 * @throws If the parsed key exceeds the maximum supported value.
 *
 * @example
 * ```ts
 * fromKey("1a2b3c"); // "equal-squat-5052"
 * ```
 */
export function fromKey(key: string): string {
    const n = parseInt(key, 16);
    if (Number.isNaN(n)) {
        throw new Error(`Invalid hexadecimal key: "${key}"`);
    }
    if (n < 0) {
        throw new Error("Key must be non-negative.");
    }
    if (n > MAX_ID) {
        throw new Error(`Key too large! Maximum allowed is ${MAX_ID.toString(16)}.`);
    }

    const adjI = Math.floor(n / NOUN_RANGE);
    const nounI = Math.floor((n % NOUN_RANGE) / NUMERIC_RANGE);
    const num = n % NUMERIC_RANGE;

    return `${adjectives[adjI]}-${nouns[nounI]}-${padNumeric(num)}`;
}

/**
 * Convert a human-readable ID (HRUID) back into its original hexadecimal key.
 *
 * This is the inverse of {@link fromKey}. It reconstructs the numeric key from
 * the adjective, noun, and 4-digit number components.
 *
 * @param hruid - A string in the form `adjective-noun-NNNN`.
 * @returns The original hexadecimal key as a lowercase string.
 *
 * @example
 * ```ts
 * toKey("equal-squat-5052"); // "1a2b3c"
 * ```
 */
export function toKey(hruid: string): string {
    const parts = hruid.split("-");
    if (parts.length !== 3) {
        throw new Error(
            `Invalid HRUID format: "${hruid}". Expected "adjective-noun-NNNN".`,
        );
    }

    const [adj, noun, numStr] = parts;
    const adjI = adjectives.indexOf(adj);
    const nounI = nouns.indexOf(noun);
    const num = parseInt(numStr, 10);

    if (adjI === -1) {
        throw new Error(`Unknown adjective: "${adj}".`);
    }
    if (nounI === -1) {
        throw new Error(`Unknown noun: "${noun}".`);
    }
    if (Number.isNaN(num) || num < 0 || num > MAX_NUMERIC) {
        throw new Error(
            `Numeric part must be between 0 and ${MAX_NUMERIC}, got: "${numStr}".`,
        );
    }

    return (adjI * NOUN_RANGE + nounI * NUMERIC_RANGE + num).toString(16);
}
