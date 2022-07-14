type randomBytesCallback = (err: Error | null, buf: Buffer) => void

export function randomBytes(size: number): Buffer;
export function randomBytes(size: number, callback: randomBytesCallback): void;

export default randomBytes

