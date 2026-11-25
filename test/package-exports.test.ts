import { execFileSync } from 'node:child_process';

function runNode(args: string[]): string {
    return execFileSync(process.execPath, args, {
        cwd: process.cwd(),
        encoding: 'utf8'
    }).trim();
}

describe('package exports', () => {
    it('loads the CommonJS entrypoint and globals export', () => {
        const output = runNode([
            '-e',
            "const api = require('barometer-trend'); const { Globals } = require('barometer-trend/globals'); console.log(typeof api.addPressure, typeof api.getAll, typeof Globals);"
        ]);

        expect(output).toBe('function function object');
    });

    it('loads the ESM entrypoint and globals export', () => {
        const output = runNode([
            '--input-type=module',
            '-e',
            "import * as api from 'barometer-trend'; import { Globals } from 'barometer-trend/globals'; console.log(typeof api.addPressure, typeof api.getAll, typeof Globals);"
        ]);

        expect(output).toBe('function function object');
    });
});
