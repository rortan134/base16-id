import { adjectives, nouns } from "./words";

const MAX_ID = 1010 * 2876 * 9999;

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
    let n = parseInt(key, 16);
    if (n > MAX_ID) {
        throw "Key too large!";
    }
    const adjI = Math.floor(n / (nouns.length * 10000));
    n -= adjI * (nouns.length * 10000);
    const nounI = Math.floor(n / 10000);
    n -= nounI * 10000;
    return `${adjectives[adjI]}-${nouns[nounI]}-${("0000" + n).slice(-4)}`;
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
    const [adj, noun, num] = hruid.split("-");
    const adjI = adjectives.indexOf(adj);
    const nounI = nouns.indexOf(noun);
    const numI = parseInt(num, 10);
    return (adjI * (nouns.length * 10000) + nounI * 10000 + numI).toString(16);
}
