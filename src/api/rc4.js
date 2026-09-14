export default class RC4 {
  constructor(key) {
    this.state = Uint8Array.from({ length: 256 }, (_, index) => index)
    this.i = 0
    this.j = 0

    for (let index = 0, j = 0; index < 256; index += 1) {
      j = (j + this.state[index] + key[index % key.length]) & 255
      ;[this.state[index], this.state[j]] = [this.state[j], this.state[index]]
    }
  }

  crypt(data) {
    const output = new Uint8Array(data.length)
    for (let index = 0; index < data.length; index += 1) {
      this.i = (this.i + 1) & 255
      this.j = (this.j + this.state[this.i]) & 255
      ;[this.state[this.i], this.state[this.j]] = [this.state[this.j], this.state[this.i]]
      const keyByte = this.state[(this.state[this.i] + this.state[this.j]) & 255]
      output[index] = data[index] ^ keyByte
    }
    return output
  }
}