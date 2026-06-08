/**
 * The verified total number of .webp frames produced by the FFmpeg pipeline.
 * Source: `ffmpeg` output — frame=1065
 */
export const TOTAL_FRAMES = 1065;

/**
 * Number of frames to load immediately before the canvas becomes interactive.
 */
export const INITIAL_BATCH_SIZE = 50;

/**
 * Maximum number of concurrent fetch requests the browser will be allowed to
 * make at any one time. Keeping this ≤ 15 prevents the HTTP connection pool
 * from being saturated, which was causing `InvalidStateError` on `createImageBitmap`.
 */
export const CONCURRENCY_LIMIT = 15;

/**
 * Linear interpolation factor applied every rAF tick between the current
 * display frame and the target frame. Lower = smoother / slower catch-up.
 * 0.08 feels like a gentle ease-out that lets viewers read each hotel scene.
 */
export const LERP_FACTOR = 0.08;

/**
 * Number of frames advanced per wheel tick. Lower = slower exploration,
 * higher = faster seek. 3 is balanced — comfortable to scroll through
 * 1 065 frames without needing to spin the wheel excessively.
 */
export const SCROLL_DELTA = 3;
