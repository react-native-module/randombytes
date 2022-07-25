import { Buffer as NodeBuffer } from './buffer'
import { randomBytesCallback } from '.'
import { MAX_BYTES } from './constants'
import { Random } from "./random-js";

export function randomBytesWithoutNativeModule (size: number): NodeBuffer
export function randomBytesWithoutNativeModule (size: number, callback: randomBytesCallback): undefined

export function randomBytesWithoutNativeModule (size: number, callback?: randomBytesCallback): NodeBuffer | undefined {
  const random = new Random();
  const randomHex = random.hex(size * 2)
  let randomBytes = NodeBuffer.from(randomHex, 'hex')

  // this is the max bytes crypto.getRandomValues
  // https://github.com/crypto-browserify/randombytes/blob/f18ded32b209f0d4c637608a11ae042ae96b4c2e/browser.js#L31
  if (size > MAX_BYTES) {
    randomBytes = NodeBuffer.from(randomBytes.subarray(0, MAX_BYTES))
  }

  if (callback != null) {
    callback(null, randomBytes)
  } else {
    return randomBytes
  }

  
}
