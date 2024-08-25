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
  const matchName = namesToMatch.length > 0
  const matchKeyword = keywordsToMatch.length > 0

  if (!matchName && !matchKeyword) {
    return true
  }

  if (matchName) {
    const itemName = item.displayName.toLowerCase()
    if (namesToMatch.some((x) => itemName.includes(x))) {
      return true
    }
  }

  if (matchKeyword) {
    const lowerCaseKeywords = item.keywords?.map((x) => x.toLowerCase())
    if (lowerCaseKeywords && keywordsToMatch.some((x) => stringInKeywords(x, lowerCaseKeywords))) {
      return true
    }
  }

  return false
}

export function getIdsToFilterOut(
  filter: string,
  keywordPrefix: string,
  itemList: readonly TrackerItem[],
): Set<number> {
  if (filter === '') {
    return new Set<number>()
  }

  const filterSegments = filter.split(' ').filter((x) => x !== '')
  const namesToMatch: string[] = []
  const keywordsToMatch: string[] = []
  for (const filterSegment of filterSegments) {
    const segment = filterSegment.toLowerCase()
    if (!keywordPrefix) {
      keywordsToMatch.push(segment)
      namesToMatch.push(segment)
    } else if (segment.startsWith(keywordPrefix)) {
      const keyword = segment.slice(1)
      keywordsToMatch.push(keyword)
    } else {
      namesToMatch.push(segment)
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
