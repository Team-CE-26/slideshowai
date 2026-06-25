// Test image set (gym / fitness lifestyle). Real photos dropped in for testing
// the look of the product. Files live in public/library/gym/.
export const GYM_IMAGE_COUNT = 19;

export const GYM_IMAGES = Array.from(
  { length: GYM_IMAGE_COUNT },
  (_, i) => `/library/gym/gym-${String(i + 1).padStart(2, "0")}.jpg`,
);
