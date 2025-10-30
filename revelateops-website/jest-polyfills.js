// Polyfills for Next.js edge runtime in Jest environment
// This file provides web APIs that Next.js edge runtime expects but aren't available in Node.js/jsdom

const { ReadableStream } = require('node:stream/web');
const { TextEncoder, TextDecoder } = require('node:util');

// IMPORTANT: Install TextEncoder/TextDecoder FIRST before importing Next.js modules
// Next.js's fetch polyfill depends on these being available globally
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = ReadableStream;

// Now we can safely import Next.js's bundled fetch polyfills
const { Request, Response, Headers, FormData } = require('next/dist/compiled/@edge-runtime/primitives/fetch');

// Install fetch-related polyfills on global object
global.Request = Request;
global.Response = Response;
global.Headers = Headers;
global.FormData = FormData;

// Export for potential direct imports
module.exports = {
  Request,
  Response,
  Headers,
  FormData,
  ReadableStream,
  TextEncoder,
  TextDecoder,
};
