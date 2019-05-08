#!/usr/bin/env node

import main from './main';
import { getPkg, Pkg, showInfo, configShell, listShell } from './utils';
import { log, err, cyan } from './tui';

const argc = process.argv.splice(2);
const input = argc[0];
const tip = input && input.startsWith('-') ? 'option' : 'command';

switch (input) {
  case undefined:
    main();
    break;

  case 'config':
    configShell();
    break;

  case 'ls':
    listShell();
    break;

  case '-v':
  case '-h':
    getPkg().then(
      (pkg: Pkg): void => log(input === '-v' ? pkg.version : showInfo(pkg))
    );
    break;

  default:
    log(
      err(
        `Unknown ${tip}: ${input}. See \`${cyan('knao -h')}\` for more details.`
      )
    );

    break;
}
