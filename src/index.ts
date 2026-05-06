import { adjectives, nouns } from "./words";

// A human-readable UID
// <adjective>-<noun>-<0000-9999>
// Address space of 1010*2876*9999 = 29,044,695,240 > 2^32
export function fromKey(key: string): string {
    let n = parseInt(key, 16);
    if (n > 1010 * 2876 * 9999) {
        throw "Key too large!";
    }
    const adjI = Math.floor(n / (nouns.length * 10000));
    n -= adjI * (nouns.length * 10000);
    const nounI = Math.floor(n / 10000);
    n -= nounI * 10000;
    return `${adjectives[adjI]}-${nouns[nounI]}-${("0000" + n).slice(-4)}`;
}

export function toKey(hruid: string): string {
    const [adj, noun, num] = hruid.split("-");
    const adjI = adjectives.indexOf(adj);
    const nounI = nouns.indexOf(noun);
    const numI = parseInt(num, 10);
    return (adjI * (nouns.length * 10000) + nounI * 10000 + numI).toString(16);
}
