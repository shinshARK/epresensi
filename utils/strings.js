/**
 * Ellipsizes a string if its length exceeds a specified maximum length.
 * Adds "..." to the end of the truncated string.
 *
 * @param {string} str - The input string.
 * @param {number} maxLength - The maximum allowed length of the string before truncation.
 * @returns {string} The original string or the ellipsized string.
 */
export function ellipsizeString(str, maxLength) {
  // Define the ellipsis character(s)
  const ellipsis = "...";

  // Check if the string is null, undefined, or not a string
  if (typeof str !== "string") {
    console.error("Input must be a string.");
    return str; // Return the original input if it's not a string
  }

  // Check if maxLength is a valid number
  if (typeof maxLength !== "number" || maxLength < 0) {
    console.error("maxLength must be a non-negative number.");
    return str; // Return original string if maxLength is invalid
  }

  // If the string length is greater than the max length, truncate it
  if (str.length > maxLength) {
    // Calculate the length to truncate to, accounting for the ellipsis
    // Ensure the truncated length is not negative
    const truncatedLength = Math.max(0, maxLength - ellipsis.length);

    // Return the truncated string followed by the ellipsis
    return str.substring(0, truncatedLength) + ellipsis;
  } else {
    // If the string is within the max length, return it as is
    return str;
  }
}

export function getLocalTimeFromISO(isoString) {
  if (!isoString || isoString === "-") {
    return "-"; // Handle empty or placeholder values
  }

  const dateObj = new Date(isoString); // Parse the ISO string into a Date object

  // Use toLocaleTimeString to get the local time string.
  // You can customize the options for format (e.g., no seconds, 24-hour format).
  return dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format (e.g., 14:30 instead of 02:30 PM)
  });
}
