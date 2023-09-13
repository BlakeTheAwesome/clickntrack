import type { TrackerItem } from '@/types/trackerItem'

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

export function getIdsToFilterOut(filter: string, itemList: Array<TrackerItem>): Set<number> {
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
