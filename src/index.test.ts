import { describe, it, expect } from "@jest/globals";
import { fromKey, toKey } from "./index";
import { adjectives, nouns } from "./words";

const NUMERIC_RANGE = 10000;
const NOUN_RANGE = nouns.length * NUMERIC_RANGE;
const MAX_ID = adjectives.length * nouns.length * NUMERIC_RANGE - 1;

describe("fromKey", () => {
    it("converts hex keys to HRUIDs", () => {
        expect(fromKey("1a2b3c")).toBe("equal-torch-5004");
        expect(fromKey("ff")).toBe("equal-squat-0255");
        expect(fromKey("deadbeef")).toBe("gruff-clip-8559");
    });

    it("accepts the maximum valid key", () => {
        const maxHex = MAX_ID.toString(16);
        const hruid = fromKey(maxHex);
        expect(toKey(hruid)).toBe(maxHex);
    });

    it("is case-insensitive for hex digits", () => {
        expect(fromKey("1A2B3C")).toBe(fromKey("1a2b3c"));
    });

    it("rejects non-hex strings", () => {
        expect(() => fromKey("1a2b3cfoo")).toThrow("Invalid hexadecimal key");
        expect(() => fromKey("")).toThrow("Invalid hexadecimal key");
        expect(() => fromKey("0x1a2b3c")).toThrow("Invalid hexadecimal key");
        expect(() => fromKey("zzz")).toThrow("Invalid hexadecimal key");
        expect(() => fromKey("-1")).toThrow("Invalid hexadecimal key");
    });

    it("rejects keys above MAX_ID", () => {
        const tooBig = (MAX_ID + 1).toString(16);
        expect(() => fromKey(tooBig)).toThrow("Key too large");
    });
});

describe("toKey", () => {
    it("converts HRUIDs back to hex keys", () => {
        expect(toKey("equal-torch-5004")).toBe("1a2b3c");
        expect(toKey("equal-squat-0255")).toBe("ff");
    });

    it("is bijective with fromKey for a range of values", () => {
        for (let i = 0; i < 1000; i++) {
            const key = i.toString(16);
            expect(toKey(fromKey(key))).toBe(key);
        }
    });

    it("rejects malformed formats", () => {
        expect(() => toKey("invalid")).toThrow("Invalid HRUID format");
        expect(() => toKey("a-b-c-d")).toThrow("Invalid HRUID format");
        expect(() => toKey("equal-squat")).toThrow("Invalid HRUID format");
        expect(() => toKey("equal-squat-0001-extra")).toThrow(
            "Invalid HRUID format",
        );
    });

    it("rejects unknown adjectives", () => {
        expect(() => toKey("xyzabc-squat-0001")).toThrow(
            "Unknown adjective",
        );
    });

    it("rejects unknown nouns", () => {
        expect(() => toKey("equal-xyzabc-0001")).toThrow("Unknown noun");
    });

    it("rejects non-integer numeric parts", () => {
        expect(() => toKey("equal-squat-abc")).toThrow(
            "Numeric part must be an integer",
        );
        expect(() => toKey("equal-squat-1.5")).toThrow(
            "Numeric part must be an integer",
        );
        expect(() => toKey("equal-squat-")).toThrow(
            "Numeric part must be an integer",
        );
    });

    it("rejects out-of-range numeric parts", () => {
        expect(() => toKey("equal-squat-10000")).toThrow(
            "Numeric part must be between 0 and 9999",
        );
    });
});
