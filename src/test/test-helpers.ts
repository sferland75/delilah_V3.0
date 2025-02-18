/**
 * Normalizes string whitespace for comparison
 */
export function normalizeWhitespace(str: string): string {
  return str
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\n+/g, '\n')   // Remove multiple newlines
    .replace(/[ \t]+/g, ' ') // Normalize spaces and tabs
    .trim();                 // Remove leading/trailing whitespace
}

/**
 * Creates a test matcher for string content ignoring whitespace differences
 */
export function toMatchNormalizedString(received: string, expected: string) {
  const normalizedReceived = normalizeWhitespace(received);
  const normalizedExpected = normalizeWhitespace(expected);

  const pass = normalizedReceived === normalizedExpected;

  return {
    pass,
    message: () =>
      `Expected strings to ${pass ? 'not ' : ''}match after normalizing whitespace:\n` +
      `Received: "${normalizedReceived}"\n` +
      `Expected: "${normalizedExpected}"`,
  };
}

// Add custom matcher to Jest
expect.extend({
  toMatchNormalizedString,
});