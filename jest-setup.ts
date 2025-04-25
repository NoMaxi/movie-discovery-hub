import { TextEncoder } from "util";

/**
 * TextEncoder/TextDecoder polyfills for Node.js environment.
 * These are needed because some DOM APIs used by React require them
 * but they're not available in the Node.js environment by default.
 */
if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder;
}
