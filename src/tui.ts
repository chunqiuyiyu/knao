// Some tools to beautify our terminal output
export const { log } = console;

export function ok(msg: string): string {
  return `\x1b[42m\x1b[37m OK \x1b[0m ${msg}`;
}

export function err(msg: string): string {
  return `\x1b[41m\x1b[37m ERROR \x1b[0m ${msg}`;
}

export function info(msg: string): string {
  return `\x1b[44m\x1b[37m INFO \x1b[0m ${msg}`;
}

export function cyan(msg: string): string {
  return `\x1b[36m${msg}\x1b[0m`;
}

export function green(msg: string): string {
  return `\x1b[32m${msg}\x1b[0m`;
}
