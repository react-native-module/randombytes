const getRandomValues = require('@react-native-module/get-random-values')

const NodeBuffer: BufferConstructor = typeof global.Buffer === 'undefined'
  ? require('buffer').Buffer
  : global.Buffer

type randomBytesCallback = (err: Error | null, buf: Buffer) => void

const MAX_BYTES = 65536
function randomBytesWithoutNativeModule (size: number, callback?: randomBytesCallback): Buffer | void {
  try {
    const bytes = Buffer.alloc(size)
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

function randomBytes (size: number, callback?: randomBytesCallback): Buffer | void {
  if (callback == null) {
    return randomBytesWithoutNativeModule(size)
  } else {
    // For running on Not native runtime
    const isRunningOnReactNative = globalThis.navigator && globalThis.navigator.product && globalThis.navigator.product === 'ReactNative'
    if (!isRunningOnReactNative) {
      if (callback != null) {
        randomBytesWithoutNativeModule(size, callback)
        return
      } else {
        return randomBytesWithoutNativeModule(size)
      }
    }
  }

  const RNRandomBytes = require('react-native').NativeModules.RNRandomBytes
  RNRandomBytes.randomBytes(size, function (err: Error | null, base64String: string) {
    if (err != null) {
      callback(err, null)
    } else {
      callback(null, NodeBuffer.from(base64String, 'base64'))
    }
  })
}

module.exports = randomBytes
