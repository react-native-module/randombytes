import { getRandomValues } from '@react-native-module/get-random-values'
import { Environment } from '@react-native-module/utility'
import { Buffer as NodeBuffer } from 'buffer'

type randomBytesCallback = (err: Error | null, buf: NodeBuffer | null) => undefined

const MAX_BYTES = 65536

function randomBytesWithoutNativeModule (size: number): NodeBuffer
function randomBytesWithoutNativeModule (size: number, callback: randomBytesCallback): undefined

function randomBytesWithoutNativeModule (size: number, callback?: randomBytesCallback): NodeBuffer | undefined {
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

export function randomBytes (size: number): NodeBuffer
export function randomBytes (size: number, callback: randomBytesCallback): undefined

export function randomBytes (size: number, callback?: randomBytesCallback): NodeBuffer | undefined {
  if (callback == null) {
    return randomBytesWithoutNativeModule(size)
  } else {
    // For running on Not native runtime
    if (Environment !== 'NativeMobile') {
      if (callback != null) {
        return randomBytesWithoutNativeModule(size, callback)
      } else {
        return randomBytesWithoutNativeModule(size)
      }
    }
  }

  try {
    const RNRandomBytes = require('react-native').NativeModules.RNRandomBytes
    RNRandomBytes.randomBytes(size, function (err: Error | null, base64String: string) {
      if (err != null) {
        callback(err, null)
      } else {
        callback(null, NodeBuffer.from(base64String, 'base64'))
      }
    })
  // if you reached here
  // may your environment is not supported
  // Please submit PR
  } catch (error) {
    callback(error, null)
  }
}
