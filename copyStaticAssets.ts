// eslint-disable-next-line node/no-unpublished-import
import * as shell from 'shelljs';

shell.mkdir('-p', 'dist/public/downloaded/');
shell.cp('-R', 'src/public/*', 'dist/public/');
