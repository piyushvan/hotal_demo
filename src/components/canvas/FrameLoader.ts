import {
  TOTAL_FRAMES,
  INITIAL_BATCH_SIZE,
  CONCURRENCY_LIMIT,
} from "@/lib/constants";

export class FrameLoader {
  private static instance: FrameLoader;

  private readonly totalFrames = TOTAL_FRAMES;
  private frames: (ImageBitmap | null)[] = new Array(this.totalFrames + 1).fill(
    null,
  );
  private loadedCount = 0;
  // Tracks frames that are currently being fetched (in-flight).
  // Distinct from frames[], which only holds successfully decoded bitmaps.
  private inFlightState: boolean[] = [];
  // MISSING: Loading state tracker to prevent duplicate fetch requests
  private loadingState: boolean[] = [];
  private initialBatchReady = false;
  private onReadyCallbacks: (() => void)[] = [];

  private constructor() {
    // Initialize state arrays
    this.inFlightState = new Array(this.totalFrames + 1).fill(false);
    this.loadingState = new Array(this.totalFrames + 1).fill(false);
  }

  public static getInstance(): FrameLoader {
    if (!FrameLoader.instance) {
      FrameLoader.instance = new FrameLoader();
    }
    return FrameLoader.instance;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  public getFrame(index: number): ImageBitmap | null {
    if (index < 1 || index > this.totalFrames) return null;
    return this.frames[index];
  }

  /**
   * Returns the index of the closest frame that has already been decoded,
   * searching outward from `target` in both directions up to 60 frames away.
   * This prevents the canvas from showing a black flash when the exact target
   * frame is still loading — instead it displays the nearest available one.
   */
  public getNearestLoadedFrame(target: number): number {
    if (this.frames[target]) return target;
    for (let offset = 1; offset <= 60; offset++) {
      const prev = target - offset;
      const next = target + offset;
      if (prev >= 1 && this.frames[prev]) return prev;
      if (next <= this.totalFrames && this.frames[next]) return next;
    }
    return target; // fallback: let the draw function handle the null case
  }

  public getLoadedCount(): number {
    return this.loadedCount;
  }

  public getTotalFrames(): number {
    return this.totalFrames;
  }

  /** Returns true once the initial batch of frames has been decoded and cached. */
  public isReady(): boolean {
    return this.initialBatchReady;
  }

  /** Registers a one-shot callback that fires when the initial batch is ready. */
  public onReady(cb: () => void): void {
    if (this.initialBatchReady) {
      cb();
      return;
    }
    this.onReadyCallbacks.push(cb);
  }

  // ─── Preloading ────────────────────────────────────────────────────────────

  public async preloadAll(): Promise<void> {
    try {
      console.log(
        `[FrameLoader] Initialising — loading first ${INITIAL_BATCH_SIZE} frames immediately.`,
      );

      // Batch A: Load the initial frames synchronously so the canvas can paint fast.
      const initialIndices = Array.from(
        { length: Math.min(INITIAL_BATCH_SIZE, this.totalFrames) },
        (_, i) => i + 1,
      );
      await this.loadFramesWithConcurrencyLimit(
        initialIndices,
        CONCURRENCY_LIMIT,
      );

      this.initialBatchReady = true;
      this.onReadyCallbacks.forEach((cb) => cb());
      this.onReadyCallbacks = [];

      console.log(
        `[FrameLoader] Initial batch complete — ${this.loadedCount} frames cached. Canvas is ready to paint.`,
      );

      // Batch B: Progressive interleaved sweep for the rest of the frames.
      // Descending step sizes ensure coarser coverage is available first,
      // giving a smooth scrub experience even before all frames are loaded.
      const intervals = [20, 10, 5, 1];

      for (const step of intervals) {
        const indices: number[] = [];

        for (let i = INITIAL_BATCH_SIZE + 1; i <= this.totalFrames; i++) {
          if ((i - (INITIAL_BATCH_SIZE + 1)) % step === 0) {
            if (!this.isFrameLoadedOrLoading(i)) {
              indices.push(i);
            }
          }
        }

        if (indices.length > 0) {
          await this.loadFramesWithConcurrencyLimit(indices, CONCURRENCY_LIMIT);
        }
      }

      console.log(
        `[FrameLoader] All frames loaded — total cached: ${this.loadedCount} / ${this.totalFrames}`,
      );
    } catch (error) {
      console.error(`[FrameLoader] Critical error during preloading:`, error);
    }
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  /**
   * Processes `indices` with true concurrency control using individual async
   * operations to prevent starvation when individual requests fail or hang.
   */
  private async loadFramesWithConcurrencyLimit(
    indices: number[],
    limit: number,
  ): Promise<void> {
    // Process indices in controlled batches to prevent connection pool saturation
    for (let i = 0; i < indices.length; i += limit) {
      const chunk = indices.slice(i, i + limit);

      // Use Promise.allSettled to prevent one failing request from blocking others
      const results = await Promise.allSettled(
        chunk.map((idx) => this.loadFrame(idx)),
      );

      // Log any failures in the chunk without stopping the entire process
      results.forEach((result, idx) => {
        if (result.status === "rejected") {
          console.warn(
            `[FrameLoader] Frame ${chunk[idx]} failed to load:`,
            result.reason,
          );
        }
      });
    }
  }

  /**
   * Added: Check if frame is already loaded OR currently being loaded
   * This prevents duplicate fetch requests and starvation
   */
  private isFrameLoadedOrLoading(index: number): boolean {
    return !!this.frames[index] || !!this.loadingState[index];
  }

  private isFrameLoadedOrInFlight(index: number): boolean {
    return !!this.frames[index] || !!this.inFlightState[index];
  }

  private getFrameUrl(index: number): string {
    const paddedIndex = index.toString().padStart(6, "0");
    return `/master_frames/frame_${paddedIndex}.webp`;
  }

  private async loadFrame(index: number): Promise<void> {
    if (
      index < 1 ||
      index > this.totalFrames ||
      this.frames[index] !== null ||
      this.loadingState[index] ||
      this.inFlightState[index]
    ) {
      return;
    }

    // Set loading state immediately to prevent duplicate requests
    this.loadingState[index] = true;
    this.inFlightState[index] = true;

    try {
      const url = this.getFrameUrl(index);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status} for frame ${index}: ${response.statusText}`,
        );
      }

      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      this.frames[index] = bitmap;
      this.loadedCount++;
    } catch (error) {
      console.warn(`[FrameLoader] Failed to load frame ${index}:`, error);
      throw error; // Re-throw for Promise.allSettled to handle
    } finally {
      // Clear loading states gracefully
      this.loadingState[index] = false;
      this.inFlightState[index] = false;
    }
  }
}

export const frameLoader = FrameLoader.getInstance();
