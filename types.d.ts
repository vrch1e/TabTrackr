export interface Visit {
  id?: number,
  site: string,
  totalTimeSpent: number
}

export interface TabListProps {
  tabs: Visit[]
}

