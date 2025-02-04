type RatingUpdateCallback = () => void;

class RatingEventEmitter {
  private listeners: Map<string, Set<RatingUpdateCallback>>;

  constructor() {
    this.listeners = new Map();
  }

  subscribe(productId: string, callback: RatingUpdateCallback) {
    if (!this.listeners.has(productId)) {
      this.listeners.set(productId, new Set());
    }
    this.listeners.get(productId)?.add(callback);

    return () => {
      this.listeners.get(productId)?.delete(callback);
      if (this.listeners.get(productId)?.size === 0) {
        this.listeners.delete(productId);
      }
    };
  }

  emit(productId: string) {
    this.listeners.get(productId)?.forEach((callback) => callback());
  }
}

export const ratingEvents = new RatingEventEmitter();
