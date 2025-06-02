interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

interface RateLimitEntry {
  attempts: number;
  windowStart: number;
}

class RateLimiter {
  private cache: Map<string, RateLimitEntry>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.cache = new Map();
    this.config = config;
  }

  private cleanOldEntries() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.windowStart >= this.config.windowMs) {
        this.cache.delete(key);
      }
    }
  }

  check(key: string): { allowed: boolean; msBeforeNext?: number } {
    this.cleanOldEntries();
    const now = Date.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.cache.set(key, { attempts: 1, windowStart: now });
      return { allowed: true };
    }

    if (now - entry.windowStart >= this.config.windowMs) {
      // Reset window
      this.cache.set(key, { attempts: 1, windowStart: now });
      return { allowed: true };
    }

    if (entry.attempts >= this.config.maxAttempts) {
      const msBeforeNext = this.config.windowMs - (now - entry.windowStart);
      return { allowed: false, msBeforeNext };
    }

    entry.attempts++;
    return { allowed: true };
  }
}

// Create rate limiters with different configurations
export const authRateLimiter = new RateLimiter({
  maxAttempts: 5,    // 5 attempts
  windowMs: 300000,  // per 5 minutes
});

export const emailRateLimiter = new RateLimiter({
  maxAttempts: 3,    // 3 attempts
  windowMs: 600000,  // per 10 minutes
}); 