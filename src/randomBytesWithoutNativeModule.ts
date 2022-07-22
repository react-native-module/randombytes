import { getRandomValues } from '@react-native-module/get-random-values'
import { Buffer as NodeBuffer } from 'buffer'
import { randomBytesCallback } from '.'
import { MAX_BYTES } from './constants'

export function randomBytesWithoutNativeModule (size: number): NodeBuffer
export function randomBytesWithoutNativeModule (size: number, callback: randomBytesCallback): undefined

export function randomBytesWithoutNativeModule (size: number, callback?: randomBytesCallback): NodeBuffer | undefined {
  try {
    const bytes = NodeBuffer.alloc(size)
    // this is the max bytes crypto.getRandomValues
    // https://github.com/crypto-browserify/randombytes/blob/f18ded32b209f0d4c637608a11ae042ae96b4c2e/browser.js#L31
    if (size > MAX_BYTES) {
      for (let i = 0; i < bytes.byteLength; i += MAX_BYTES) {
        getRandomValues(bytes.subarray(i, i + MAX_BYTES))
      }
    } else {
      getRandomValues(bytes)
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
