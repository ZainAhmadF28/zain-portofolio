/**
 * Performance Monitor Utility
 * Monitors FPS, memory usage, and provides performance insights
 */

class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.enabled = false;
    
    // Performance thresholds
    this.thresholds = {
      fps: {
        good: 55,
        ok: 30,
        bad: 20
      },
      memory: {
        warning: 50 * 1024 * 1024, // 50MB
        critical: 100 * 1024 * 1024 // 100MB
      }
    };

    this.stats = {
      fps: [],
      memory: [],
      renderTime: []
    };
  }

  start() {
    this.enabled = true;
    this.lastTime = performance.now();
    this.update();
  }

  stop() {
    this.enabled = false;
  }

  update() {
    if (!this.enabled) return;

    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    this.frameCount++;

    // Calculate FPS every second
    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.stats.fps.push(this.fps);
      
      // Keep only last 60 samples
      if (this.stats.fps.length > 60) {
        this.stats.fps.shift();
      }

      this.frameCount = 0;
      this.lastTime = currentTime;

      // Check memory if available
      if (performance.memory) {
        const memoryUsage = performance.memory.usedJSHeapSize;
        this.stats.memory.push(memoryUsage);
        
        if (this.stats.memory.length > 60) {
          this.stats.memory.shift();
        }
      }
    }

    requestAnimationFrame(() => this.update());
  }

  getStatus() {
    const avgFps = this.getAverageFPS();
    
    let status = 'good';
    if (avgFps < this.thresholds.fps.bad) {
      status = 'bad';
    } else if (avgFps < this.thresholds.fps.ok) {
      status = 'ok';
    }

    return {
      fps: this.fps,
      avgFps: avgFps,
      status: status,
      memory: this.getCurrentMemory(),
      suggestions: this.getSuggestions(status)
    };
  }

  getAverageFPS() {
    if (this.stats.fps.length === 0) return 0;
    const sum = this.stats.fps.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.stats.fps.length);
  }

  getCurrentMemory() {
    if (!performance.memory) return null;
    
    const used = performance.memory.usedJSHeapSize;
    const total = performance.memory.totalJSHeapSize;
    const limit = performance.memory.jsHeapSizeLimit;

    return {
      used: (used / 1024 / 1024).toFixed(2) + ' MB',
      total: (total / 1024 / 1024).toFixed(2) + ' MB',
      limit: (limit / 1024 / 1024).toFixed(2) + ' MB',
      percentage: ((used / limit) * 100).toFixed(1) + '%'
    };
  }

  getSuggestions(status) {
    const suggestions = [];

    if (status === 'bad') {
      suggestions.push('Consider disabling 3D assets using the toggle button');
      suggestions.push('Close other browser tabs to free up resources');
      suggestions.push('Lower your browser zoom level');
    } else if (status === 'ok') {
      suggestions.push('Performance is acceptable but could be improved');
      suggestions.push('Try disabling 3D assets if you experience lag');
    }

    // Memory warnings
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize;
      if (used > this.thresholds.memory.critical) {
        suggestions.push('High memory usage detected - consider refreshing the page');
      } else if (used > this.thresholds.memory.warning) {
        suggestions.push('Memory usage is elevated - monitor for issues');
      }
    }

    return suggestions;
  }

  // Method untuk log metrics ke console (development only)
  logMetrics() {
    if (import.meta.env.PROD) return;

    const status = this.getStatus();
    console.group('⚡ Performance Metrics');
    console.log(`FPS: ${status.fps} (avg: ${status.avgFps})`);
    console.log(`Status: ${status.status.toUpperCase()}`);
    if (status.memory) {
      console.log(`Memory: ${status.memory.used} / ${status.memory.limit} (${status.memory.percentage})`);
    }
    if (status.suggestions.length > 0) {
      console.log('Suggestions:', status.suggestions);
    }
    console.groupEnd();
  }

  // Export data untuk analytics
  exportData() {
    return {
      timestamp: new Date().toISOString(),
      fps: {
        current: this.fps,
        average: this.getAverageFPS(),
        history: [...this.stats.fps]
      },
      memory: this.getCurrentMemory(),
      userAgent: navigator.userAgent,
      devicePixelRatio: window.devicePixelRatio,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  performanceMonitor.start();
  
  // Log metrics every 5 seconds in development
  setInterval(() => {
    performanceMonitor.logMetrics();
  }, 5000);
}

export default PerformanceMonitor;
