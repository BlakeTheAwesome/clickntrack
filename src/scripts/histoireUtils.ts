import type { Component } from 'vue'
import { logEvent } from 'histoire/client'

export function logEmits(storyComponent: Component) {
  if (!('emits' in storyComponent)) {
    return
  }

  const ret: Record<string, typeof logEvent> = {}

  let emits = storyComponent.emits
  if (!(emits instanceof Array)) {
    emits = Object.keys(emits)
  }
  for (const eventName of emits) {
    ret[eventName] = (...args) => logEvent(eventName, args)
  }
  return ret
}
