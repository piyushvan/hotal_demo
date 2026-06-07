export class FrameLoader {
  private static instance: FrameLoader;
  private readonly totalFrames = 1065;
  private frames: (ImageBitmap | null)[] = new Array(this.totalFrames + 1).fill(null);
  private loadedCount = 0;
  private loadingSet = new Set<number>();

  private constructor() {}

  public static getInstance(): FrameLoader {
    if (!FrameLoader.instance) {
      FrameLoader.instance = new FrameLoader();
    }
    return FrameLoader.instance;
  }

  public getFrame(index: number): ImageBitmap | null {
    if (index < 1 || index > this.totalFrames) return null;
    return this.frames[index];
  }

  private getFrameUrl(index: number): string {
    const paddedIndex = index.toString().padStart(6, '0');
    return `/master_frames/frame_${paddedIndex}.webp`;
  }

  public async preloadAll(): Promise<void> {
    try {
      console.log(`[FramePreloader] Initializing Critical Batch A (Frames 1-50)`);
      
      // Batch A: Immediate loading of frames 1 through 50
      const batchA: Promise<void>[] = [];
      for (let i = 1; i <= Math.min(50, this.totalFrames); i++) {
        batchA.push(this.loadFrame(i));
      }
      
      await Promise.all(batchA);
      console.log(`[FramePreloader] Critical Batch A Complete. 50 Frames Cached via ImageBitmap. Ready to paint.`);

      // Batch B: Progressive interleaved fetching for all remaining frames
      const intervals = [20, 10, 5, 1];
      
      for (const step of intervals) {
        const batch: Promise<void>[] = [];
        for (let i = 51; i <= this.totalFrames; i += step) {
          batch.push(this.loadFrame(i));
        }
        await Promise.all(batch);
      }

      console.log(`[FrameLoader] Progressive interleaved fetching completed. Cached frames: ${this.loadedCount}`);

    } catch (error) {
      console.error(`[FrameLoader] Critical error during preloading:`, error);
    }
  }

  private async loadFrame(index: number): Promise<void> {
    if (index < 1 || index > this.totalFrames || this.frames[index] !== null || this.loadingSet.has(index)) {
      return;
    }

    this.loadingSet.add(index);

    try {
      const url = this.getFrameUrl(index);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch frame ${index}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      
      this.frames[index] = bitmap;
      this.loadedCount++;
      
      console.log(`[FrameLoader] Current successfully cached frame count: ${this.loadedCount}`);
    } catch (error) {
      console.warn(`[FrameLoader] Error creating ImageBitmap for frame ${index}:`, error);
    } finally {
      this.loadingSet.delete(index);
    }
  }
}

export const frameLoader = FrameLoader.getInstance();
