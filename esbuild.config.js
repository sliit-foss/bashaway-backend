const path = require('path');
const execSync = require('child_process').execSync;
const { globPlugin } = require('esbuild-plugin-glob');

execSync('npx rimraf ./dist && mkdir dist');

const copy = ['json', 'html', 'png'];

const alias = {
  name: 'alias',
  setup(build) {
    build.onResolve({ filter: /^@\/.*/ }, (args) => {
      console.log('Entered onResolve');
      return {
        path: path.resolve(__dirname, './src', args.path.replace(/^@\//, ''))
      };
    });
  }
};

require('esbuild')
  .build({
    entryPoints: [`./src/**/*.{js,${copy.join(',')}}`],
    bundle: false,
    outdir: './dist',
    outbase: './src',
    platform: 'node',
    target: 'node16.0',
    format: 'cjs',
    minify: false,
    sourcemap: true,
    keepNames: true,
    loader: copy.reduce((acc, ext) => ({ ...acc, [`.${ext}`]: 'copy' }), {}),
    plugins: [alias, globPlugin()]
  })
  .catch(() => process.exit(1));
