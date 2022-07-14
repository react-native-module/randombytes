const getRandomValues = require('@react-native-module/get-random-values')

const NodeBuffer: BufferConstructor = typeof global.Buffer === 'undefined'
  ? require('buffer').Buffer
  : global.Buffer

const RNRandomBytes = require('react-native').NativeModules.RNRandomBytes

function toBuffer (nativeStr: string) {
  return NodeBuffer.from(nativeStr, 'base64')
}

type randomBytesCallback = (err: Error | null, buf: Buffer) => void
function randomBytes(size: number): Buffer;
function randomBytes(size: number, callback: randomBytesCallback): void;

function randomBytes (size: number, callback?: randomBytesCallback) {
  if (!callback) {
    // const wordCount = Math.ceil(size * 0.25)
    // const randomBytes = sjcl.random.randomWords(wordCount, 10)
    // let hexString = sjcl.codec.hex.fromBits(randomBytes)
    // hexString = hexString.substr(0, size * 2)
    // return Buffer.from(hexString, 'hex')
    const MAX_BYTES = 65536
    const bytes = Buffer.alloc(4)
    for (let i = 0; i < bytes.byteLength; i += MAX_BYTES) {
      getRandomValues(bytes.subarray(i, i + MAX_BYTES))
    }
    return bytes
  }

  RNRandomBytes.randomBytes(size, function (err: Error | null, base64String: string) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, toBuffer(base64String))
    }
  })
}
