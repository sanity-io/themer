// Implements https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing

// @TODO regex check if `id` is ascii letters according to the Server-Timing spec

let getNow: () => number
try {
  performance.now()
  getNow = () => performance.now() * 1000
} catch {
  getNow = () => Date.now()
}

export class ServerTiming {
  #started = new Map<string, number>()
  #ended = new Map<string, number>()
  #desc = new Map<string, string>()

  start(id: string, desc?: string) {
    this.#started.set(id, getNow())
    if (desc) {
      this.#desc.set(id, desc)
    }
  }

  end(id: string) {
    this.#ended.set(id, getNow())
  }

  toString() {
    const timings: string[] = []
    for (const [id, start] of this.#started) {
      const end = this.#ended.has(id) ? this.#ended.get(id) : getNow()
      const dur = end - start
      const desc = this.#desc.has(id)
        ? JSON.stringify(this.#desc.get(id))
        : null
      const timing = `${id}${desc ? `;desc=${desc}` : ''};dur=${dur}`
      timings.push(timing)
    }
    return timings.join(',')
  }
}

export type ServerTimingInstance = InstanceType<typeof ServerTiming>
