import { release, homedir } from 'os';
import { writeFile, readFile, appendFile } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import { exec } from 'child_process';

import { cyan, err, ok, info, log } from './tui';

enum Platform {
  WIN = 'WIN',
  LINUX = 'LINUX',
  MAC = 'MAC',
  UNKNOWN = 'UNKNOWN'
}

// Interface of package.json
export interface Pkg {
  version: string;
  name: string;
  description: string;
}

export const configFilePath = join(homedir(), '.knaorc');
const bashConfigPath = join(homedir(), '.bashrc');

/**
 * Get correct platform informatoin base on your OS
 * @return {Platform} Win, Mac, Linux or Unknown
 */
export function currentPlatform(): Platform {
  const { platform } = process;
  if (platform === 'win32' || release().includes('Microsoft')) {
    return Platform.WIN;
  }

  if (platform === 'linux') {
    return Platform.LINUX;
  }

  if (platform === 'darwin') {
    return Platform.MAC;
  }

  return Platform.UNKNOWN;
}

/**
 * Set copy command in different OS
 * @param  {Platform} platform Win, Linux, or Mac
 * @return {string} Command: clip.exe(Win), xsel(Linux), pbcopy(Mac)
 */
export function setCmd(platform: Platform): string {
  let cmd = '';
  switch (platform) {
    case Platform.WIN:
      cmd = 'clip.exe';
      break;
    case Platform.LINUX:
      cmd = 'xclip -selection c';
      break;
    case Platform.MAC:
      cmd = 'pbcopy';
      break;
    default:
      break;
  }

  return cmd;
}

export function read(path: string): Promise<string> {
  return new Promise(
    (resolve, reject): void => {
      readFile(
        path,
        (error, data): void => {
          if (error) {
            reject(error.message);
            log(err(error.message));
            process.exit(1);
          }

          return resolve(data.toString());
        }
      );
    }
  );
}

export function write(dir: string, data: string): Promise<void> {
  return new Promise(
    (resolve, reject): void => {
      writeFile(
        dir,
        data,
        (error): void => {
          if (error) {
            reject(error.message);
            log(err(error.message));
            process.exit(1);
          }

          resolve();
        }
      );
    }
  );
}

export function append(dir: string, data: string): Promise<void> {
  return new Promise(
    (resolve, reject): void => {
      read(dir).then(
        (fileData): void => {
          if (fileData.includes(data)) {
            reject();
            process.exit(0);
          } else {
            appendFile(
              dir,
              data,
              (error): void => {
                if (error) {
                  reject(error.message);
                  log(err(error.message));
                  process.exit(1);
                }

                resolve();
              }
            );
          }
        }
      );
    }
  );
}

export async function getPkg(): Promise<Pkg> {
  const data = await read(join(__dirname, '../package.json'));
  return JSON.parse(data);
}

export function showInfo(pkg: Pkg): string {
  return `${pkg.description}

Usage:
  ${pkg.name} <command> [options]

Commands:
  config\tConfigure your shell environment
  ls\t\tOutput shell information

Options:
  -h\t\tOutput help information
  -v\t\tOutput cli version number`;
}

export function sh(cmd: string, shell?: string): Promise<string> {
  return new Promise(
    (resolve, reject): void => {
      exec(
        cmd,
        { shell },
        (error, stdout, stderr): void => {
          if (error) {
            log(err(stderr));
            reject(stderr);
            process.exit(1);
          }
          resolve(stdout.toString());
        }
      );
    }
  );
}

export function configShell(): void {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(
    info('Enter your shell environment: (bash) '),
    (answer): void => {
      const result = answer || 'bash';
      write(configFilePath, result).then(
        (): void => {
          if (result === 'bash') {
            append(
              bashConfigPath,
              '\nexport PROMPT_COMMAND="history -a"\n'
            ).then(
              (): void => {
                // In some cases(like source command), exec will login a new shell
                exec(
                  'source ~/.bashrc',
                  { shell: 'bash' },
                  (error, stdout, stderr): void => {
                    if (error) {
                      log(err(stderr));
                      process.exit(1);
                    }
                  }
                );

                log(ok(`Update ${cyan('~/.bashrc')} successfully.`));
                process.exit(0);
              }
            );
          }
          log(ok(`Current shell is ${cyan(result)}.`));
          rl.close();
        }
      );
    }
  );
}

export function listShell(): void {
  read(configFilePath).then(
    (data): void => {
      log(info(`Current shell is ${cyan(data.toString())}.`));
    }
  );
}

export function trim(str: string): string {
  return str.trim().replace(/^\d+\s+/g, '');
}

export function copy(prevCmd: string): void {
  sh(`${prevCmd} | ${setCmd(currentPlatform())}`).then(
    (): void => {
      // Success
      log(ok(`Output of \`${cyan(prevCmd)}\` has been copied.`));
      process.exit(0);
    }
  );
}
