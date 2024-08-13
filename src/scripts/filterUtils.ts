import type { TrackerItem } from '@/types/trackerItem'
import { ref } from 'vue'

function stringInKeywords(strToMatch: string, keywords: string[]): boolean {
  for (const keyword of keywords) {
    if (keyword.includes(strToMatch)) {
      return true
    }
  }
  return false
}

function itemMatchesFilters(item: TrackerItem, namesToMatch: string[], keywordsToMatch: string[]): boolean {
  if (namesToMatch.some((name) => !item.displayName.toLowerCase().includes(name))) {
    return false
  }

  const lowerCaseKeywords = item.keywords?.map((x) => x.toLowerCase())
  if (keywordsToMatch.some((x) => !lowerCaseKeywords || !stringInKeywords(x, lowerCaseKeywords))) {
    return false
  }
  return true
}

export function getIdsToFilterOut(filter: string, itemList: readonly TrackerItem[]): Set<number> {
  if (filter === '') {
    return new Set<number>()
  }

  const filterSegments = filter.split(' ').filter((x) => x !== '')
  const namesToMatch: string[] = []
  const keywordsToMatch: string[] = []
  for (const segment of filterSegments) {
    if (segment.startsWith(':')) {
      keywordsToMatch.push(segment.slice(1).toLowerCase())
    } else {
      namesToMatch.push(segment.toLowerCase())
    }
  }

  const idsToFilterOut = new Set<number>()
  for (const item of itemList) {
    if (!itemMatchesFilters(item, namesToMatch, keywordsToMatch)) {
      idsToFilterOut.add(item.id)
    }
  }
  return idsToFilterOut
}

export function useKeyboardFilter() {
  const filter = ref('')
  const onKeydown = (event: KeyboardEvent) => {
    const key = event.key
    if (key.length == 1) {
      filter.value += key
    } else if (key == 'Backspace') {
      filter.value = filter.value.slice(0, -1)
    } else if (key == 'Escape') {
      filter.value = ''
    }
  }

  return {
    filter,
    onKeydown,
  }
}
