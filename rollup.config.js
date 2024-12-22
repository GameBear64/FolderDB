import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.full.cjs',
      format: 'cjs',
      exports: 'named',
    },
    {
      file: 'dist/index.full.js',
      format: 'es',
    },
    // Would be cool but for a backend package does it matter?
    // {
    //   file: 'dist/index.cjs',
    //   format: 'cjs',
    //   exports: 'named',
    //   plugins: [terser({ keep_fnames: true })],
    // },
    // {
    //   file: 'dist/index.js',
    //   format: 'es',
    //   plugins: [terser({ keep_fnames: true })],
    // },
  ],
  plugins: [resolve(), commonjs()],
};
