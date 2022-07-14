const Buffer = typeof global.Buffer === 'undefined'
  ? require('buffer').Buffer
  : global.Buffer

const sjcl = require('sjcl')
const RNRandomBytes = require('react-native').NativeModules.RNRandomBytes

function noop () {}

function toBuffer (nativeStr) {
  return Buffer.from(nativeStr, 'base64')
}

function init () {
  if (RNRandomBytes.seed) {
    const seedBuffer = toBuffer(RNRandomBytes.seed)
    addEntropy(seedBuffer)
  } else {
    seedSJCL()
  }
}

function addEntropy (entropyBuf) {
  const hexString = entropyBuf.toString('hex')
  const stanfordSeed = sjcl.codec.hex.toBits(hexString)
  sjcl.random.addEntropy(stanfordSeed)
}

export function seedSJCL (cb) {
  cb = cb || noop
  randomBytes(4096, function (err, buffer) {
    if (err) return cb(err)

    addEntropy(buffer)
  })
}

export function randomBytes (length, cb) {
  if (!cb) {
    const size = length
    const wordCount = Math.ceil(size * 0.25)
    const randomBytes = sjcl.random.randomWords(wordCount, 10)
    let hexString = sjcl.codec.hex.fromBits(randomBytes)
    hexString = hexString.substr(0, size * 2)
    return Buffer.from(hexString, 'hex')
  }

  RNRandomBytes.randomBytes(length, function (err, base64String) {
    if (err) {
      cb(err)
    } else {
      cb(null, toBuffer(base64String))
    }
  })
}

init()
