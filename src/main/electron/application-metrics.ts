import { Logger } from '../service/logger.service';
import { app } from 'electron';
import ProcessMetric = Electron.ProcessMetric;

export class ApplicationMetrics {

  private readonly startTime: number;
  private logger: Logger;

  constructor() {
    this.startTime = Date.now();
    this.logger = Logger.getLogger('Metrics');
  }

  getUptime(): string {
    const uptime = Date.now() - this.startTime;
    return `${(uptime / 1000).toFixed(2)} seconds`;
  }

  logMetrics() {
    try {

      const appMetrics = app.getAppMetrics();

      const cpuUsage = process.cpuUsage();

      const memoryUsage = process.memoryUsage();

      const processMetrics = this.formatProcessMetrics(appMetrics);

      this.logger.debug('Application Shutdown Metrics %j', {
        uptime: this.getUptime(),
        processes: processMetrics,
        cpu: {
          user: `${(cpuUsage.user / 1000000).toFixed(2)}ms`,
          system: `${(cpuUsage.system / 1000000).toFixed(2)}ms`
        },
        memory: {
          rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)}MB`,
          heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
          heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
          external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)}MB`
        }
      });

    } catch (error) {
      this.logger.error('Error logging metrics', error);
    }
  }

  private formatProcessMetrics(metrics: ProcessMetric[]): any[] {
    return metrics.map(metric => ({
      pid: metric.pid,
      type: metric.type,
      cpu: {
        percentCPUUsage: `${(metric.cpu.percentCPUUsage * 100).toFixed(2)}%`,
        idleWakeupsPerSecond: metric.cpu.idleWakeupsPerSecond
      },
      memory: {
        workingSetSize: `${(metric.memory.workingSetSize / 1024 / 1024).toFixed(2)}MB`,
        peakWorkingSetSize: `${(metric.memory.peakWorkingSetSize / 1024 / 1024).toFixed(2)}MB`
      },
      sandboxed: metric.sandboxed,
      integrityLevel: metric.integrityLevel
    }));
  }

}
