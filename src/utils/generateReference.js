// src/utils/generateReference.js

/**
 * Generates a unique reference string for bookings and tickets.
 * Format: PREFIX-XXXXXXXX (8 random uppercase alphanumeric chars)
 */
const generateReference = (prefix = "REF") => {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${rand}`;
};

export default generateReference;
