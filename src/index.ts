import { Environment } from '@react-native-module/utility'
import { Buffer as NodeBuffer } from 'buffer'
import { randomBytesWithoutNativeModule } from './randomBytesWithoutNativeModule'

export type randomBytesCallback = (err: Error | null, buf: NodeBuffer | null) => undefined

function randomBytes (size: number): NodeBuffer
function randomBytes (size: number, callback: randomBytesCallback): undefined

function randomBytes (size: number, callback?: randomBytesCallback): NodeBuffer | undefined {
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

export default randomBytes
