/* eslint-disable node/no-unpublished-import */
import * as shell from 'shelljs';

shell.mkdir('-p', 'dist/src/public/downloaded/');
shell.cp('-R', 'src/public/*', 'dist/src/public/');
