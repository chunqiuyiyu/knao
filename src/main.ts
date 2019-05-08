import { spawn } from 'child_process';

import { read, configFilePath, copy, sh } from './utils';
import { err, cyan, log, green } from './tui';

export default function main(): void {
  read(configFilePath).then(
    (shell: string): void => {
      // Generally Use history command in Unix platform
      const subprocess = spawn('history', ['|', 'head -2'], { shell });
      // Another way is to read history file
      const hisFilePath = `~/.${shell}_history`;

      switch (shell) {
        case 'fish':
          subprocess.stdout.on(
            'data',
            (data): void => {
              const cmdArr = data.toString().split('\n');
              copy(cmdArr[1]);
            }
          );

          subprocess.stderr.on(
            'data',
            (data): void => log(err(data.toString()))
          );
          break;

        case 'zsh':
          sh(`cat ${hisFilePath} | tail -2`).then(
            (data): void => {
              copy(data.split('\n')[0].split(';')[1]);
            }
          );
          break;

        case 'bash':
          sh(`cat ${hisFilePath} | tail -1`).then(
            (data): void => {
              copy(data.split('\n')[0]);
            }
          );
          break;

        default:
          log(
            err(
              `Unknown unix shell: ${cyan(shell)}, only support ${green(
                'bash'
              )}, ${green('zsh')} and ${green('fish')}.`
            )
          );
          break;
      }
    }
  );
}
