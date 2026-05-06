# base16-id

> Turn hexadecimal keys into human-readable IDs and back.

`base16-id` converts opaque hex strings (like `1a2b3c`) into readale identifiers such as `equal-squat-5052`. Ideal for exposing internal IDs to end users in URLs, support tickets, pairing codes, or anywhere readability matters.

- **Tiny** — zero runtime dependencies
- **Bijective** — lossless round-trip conversion
- **Type-safe** — built with TypeScript

---

## Install

```bash
npm install base16-id
```

```bash
pnpm add base16-id
```

```bash
yarn add base16-id
```

## Usage

```ts
import { fromKey, toKey } from "base16-id";

// Convert a hex key to a human-readable ID
const id = fromKey("1a2b3c");
console.log(id); // "equal-squat-5052"

// Convert back to the original hex key
const key = toKey(id);
console.log(key); // "1a2b3c"
```

## API

### `fromKey(key: string): string`

Convert a hexadecimal key into a human-readable ID (HRUID).

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `key` | `string` | A hexadecimal string. Must parse to an integer ≤ `29,043,752,400` (1010 × 2876 × 9999). |

**Returns** `string` — an ID in the form `adjective-noun-NNNN`.

**Throws** if the key exceeds the maximum supported value.

**Example**

```ts
fromKey("ff");       // "equal-squat-255"
fromKey("deadbeef"); // "vapid-sniff-9199"
```

### `toKey(hruid: string): string`

Convert a human-readable ID back into its original hexadecimal key.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `hruid` | `string` | An ID in the form `adjective-noun-NNNN`. |

**Returns** `string` — the original lowercase hexadecimal key.

**Example**

```ts
toKey("equal-squat-5052"); // "1a2b3c"
```

## How it works

Each ID is composed of three parts:

1. **Adjective** — chosen from a list of 1,010 words
2. **Noun** — chosen from a list of 2,876 words
3. **Number** — a zero-padded 4-digit value from `0000` to `9999`

This gives a total addressable space of **~29 billion** unique IDs (`1010 × 2876 × 9999`).

The conversion is a simple positional encoding: the numeric value of the hex key is decomposed into an adjective index, a noun index, and a remaining 4-digit suffix. Because the mapping is deterministic and bijective, every valid hex key maps to exactly one HRUID and vice versa.
