import fs from 'fs';
import path from 'path';

export interface LogEntry {
  level: string;
  timestamp: string;
  message: string;
  name: string;
}

export class Logger {

  private static loggers = new Map<string, Logger>();
  private static readonly MAX_MEMORY_LOGS = 1000;
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private static readonly MAX_LOG_FILES = 5;
  private static readonly LOG_DIR = 'logs';
  private readonly name: string;

  private constructor(name: string) {
    this.name = name;
    this.ensureLogDirectory();
  }

  static getLoggerByClass(obj: Object) {
    return this.getLogger(obj.constructor.name);
  }

  static getLogger(name: string): Logger {
    if (!this.loggers.has(name)) {
      this.loggers.set(name, new Logger(name));
    }
    return this.loggers.get(name)!;
  }

  debug(message: string, ...args: any[]): void {
    this.log('DEBUG', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log('ERROR', message, ...args);
  }

  private ensureLogDirectory() {
    const logDir = path.join(process.cwd(), Logger.LOG_DIR);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private async rotateLogFiles() {
    const logDir = path.join(process.cwd(), Logger.LOG_DIR);
    const currentLogFile = path.join(logDir, 'app.log');

    if (fs.existsSync(currentLogFile)) {
      const stats = fs.statSync(currentLogFile);
      if (stats.size >= Logger.MAX_FILE_SIZE) {
        for (let i = Logger.MAX_LOG_FILES - 1; i > 0; i--) {
          const oldFile = path.join(logDir, `app.${i}.log`);
          const newFile = path.join(logDir, `app.${i + 1}.log`);
          if (fs.existsSync(oldFile)) {
            if (i === Logger.MAX_LOG_FILES - 1) {
              fs.unlinkSync(oldFile);
            } else {
              fs.renameSync(oldFile, newFile);
            }
          }
        }
        fs.renameSync(currentLogFile, path.join(logDir, 'app.1.log'));
      }
    }
  }

  private async persistLog(logEntry: LogEntry) {
    const logDir = path.join(process.cwd(), Logger.LOG_DIR);
    const logFile = path.join(logDir, 'app.log');
    const logLine = `${logEntry.timestamp} [${logEntry.level}] [${logEntry.name}] - ${logEntry.message}\n`;

    try {
      await this.rotateLogFiles();
      fs.appendFileSync(logFile, logLine);
    } catch (error) {
      console.error('Error persisting log:', error);
    }
  }

  private async log(level: string, message: string, ...args: any[]): Promise<void> {

    const formattedMessage = this.formatMessage(message, ...args);

    const logEntry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message: formattedMessage,
      name: this.name
    };

    await this.persistLog(logEntry);

    // @ts-ignore
    console[level.toLowerCase()](`${logEntry.timestamp} [${logEntry.level}] [${logEntry.name}] - ${logEntry.message}`);
  }

  private formatMessage(message: string, ...args: any[]): string {
    if (args.length > 0) {
      return this.replaceStr(message, args);
    }
    return message;
  }

  private replaceStr(formattedMessage: string, args: any[]) {
    return formattedMessage.replace(/%[sdifjo]/g, (match) => {
      const arg = args.shift();
      switch (match) {
        case '%s':
          return String(arg);
        case '%d':
          return Number(arg).toString();
        case '%i':
          return parseInt(arg).toString();
        case '%f':
          return parseFloat(arg).toString();
        case '%j':
          return JSON.stringify(arg);
        case '%o':
          return Object.prototype.toString.call(arg);
        default:
          return match;
      }
    });
  }

}
