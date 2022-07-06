import winston, { config, createLogger, format, transports } from "winston";

interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any;
}

const levelTransfer = (tag: string) => {
  switch (tag) {
    case "e":
      return "error";
    case "w":
      return "warn";
    case "i":
      return "info";
    case "d":
      return "debug";
    case "s":
      return "silly";
  }
};

const customLevels: config.AbstractConfigSetLevels = {
  e: 0,
  w: 1,
  i: 2,
  d: 3,
  s: 4,
};

const customColors: config.AbstractConfigSetColors = {
  e: "red",
  w: "yellow",
  i: "cyan",
  d: "magenta",
  s: "gray",
};

winston.addColors(customColors);

export interface LogLevels extends winston.Logger {
  e: winston.LeveledLogMethod;
  w: winston.LeveledLogMethod;
  i: winston.LeveledLogMethod;
  d: winston.LeveledLogMethod;
  s: winston.LeveledLogMethod;
}

export const logger: LogLevels = <LogLevels>createLogger({
  levels: customLevels,
  format: format.combine(
    format.label({ label: "[NodeTemplate-Server]" }),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.colorize(),
    format.printf(
      (info: TransformableInfo) =>
        `${info.timestamp} - ${levelTransfer(info.level)}: ${info.label} ${
          info.message
        }`,
    ),
  ),
  transports: [
    new transports.Console({ level: "s" }),
    new transports.File({ filename: "error.log", level: "e" }),
  ],
});

export const logStream = {
  write: (message: any) => {
    logger.log("i", message);
  },
};
