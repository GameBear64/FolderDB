import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'dist/index.js',
      format: 'es',
    },
  ],
  plugins: [resolve(), commonjs()],
};
