import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json' assert { type: 'json' }

const external = [
  ...new Set([
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.dependencies),
  ]),
]

export default [
  {
    input: 'src/index.ts',
    external,
    plugins: [resolve(), commonjs(), typescript()],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'es',
      },
    ],
  },
  {
    input: './types/index.d.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
]
