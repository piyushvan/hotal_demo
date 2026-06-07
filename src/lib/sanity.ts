export interface SanityConfig {
  projectId: string;
  dataset: string;
}

export function createSanityClient(config: SanityConfig) {
  return {
    fetch: async () => [],
    config,
  };
}
