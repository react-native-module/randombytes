import { Environment } from '@react-native-module/utility'
import { Buffer as NodeBuffer } from 'buffer'
import { randomBytesCallback } from '.'
import { MAX_BYTES } from './constants'

export function randomBytesWithoutNativeModule (size: number): NodeBuffer
export function randomBytesWithoutNativeModule (size: number, callback: randomBytesCallback): undefined

export function randomBytesWithoutNativeModule (size: number, callback?: randomBytesCallback): NodeBuffer | undefined {
  if (Environment === 'NativeMobile') {
    throw Error('randomBytesWithoutNativeModule can not running on NativeMobile')
  }
  if (Environment === 'NodeJs') {
    const crypto = require('crypto')
    if (callback) return crypto.randomBytes(size, callback)
    return crypto.randomBytes(size)
  }
  const crypto = global.crypto || global.msCrypto
  if (!crypto.getRandomValues) {
    throw Error('randomBytesWithoutNativeModule can not run (crypto.getRandomValues is not exists)')
  }
  try {
    const bytes = NodeBuffer.alloc(size)
    // this is the max bytes crypto.getRandomValues
    // https://github.com/crypto-browserify/randombytes/blob/f18ded32b209f0d4c637608a11ae042ae96b4c2e/browser.js#L31
    if (size > MAX_BYTES) {
      for (var generated = 0; generated < size; generated += MAX_BYTES) {
        // buffer.slice automatically checks if the end is past the end of
        // the buffer so we don't have to here
        crypto.getRandomValues(bytes.subarray(generated, generated + MAX_BYTES))
      }
    } else {
      crypto.getRandomValues(bytes)
    }
    if (callback != null) {
      callback(null, bytes)
      return
    }
    return bytes
  } catch (err) {
    if (callback != null) {
      callback(err, null)
    } else {
      throw err
    }
  }
}
