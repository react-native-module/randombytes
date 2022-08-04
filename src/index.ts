import { Buffer as NodeBuffer } from 'buffer'
import { randomBytesWithoutNativeModule } from './randomBytesWithoutNativeModule'

export type randomBytesCallback = (err: Error | null, buf: NodeBuffer | null) => undefined

function randomBytes (size: number): NodeBuffer
function randomBytes (size: number, callback: randomBytesCallback): undefined

function randomBytes (size: number, callback?: randomBytesCallback): NodeBuffer | void {
  try {
    const RNRandomBytes = require('react-native').NativeModules.RNRandomBytes
    if (!callback) {
        return RNRandomBytes.randomBytesSync(size)
    }
    RNRandomBytes.randomBytes(size, (err: Error | null, base64String: string) => {
      if (err != null) {
          callback(err, null)
      } else {
          callback(null, NodeBuffer.from(base64String, 'base64'))
      }
    })
  } catch (error) {
    if (error) {
      if (['randomBytesSync', 'randomBytes'].some(v => error.message.includes(`Cannot read property '${v}' of null`)) ) {
        if (callback != null) {
          return randomBytesWithoutNativeModule(size, callback)
        } else {
          return randomBytesWithoutNativeModule(size)
        }
      }
    }
    if (callback) {
      callback(error, null)
    } else {
      throw error
    }
  }
}

export default randomBytes
