import Rand from 'rand-seed'

export function shuffle<T>(arr: Array<T>, seed: string): Array<T> {
  const ret = [...arr]

  if (seed === '') {
    return ret
  }

  const rng = new Rand(seed)
  for (let i = ret.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
    ;[ret[i], ret[j]] = [ret[j], ret[i]]
  }
  return ret
}
