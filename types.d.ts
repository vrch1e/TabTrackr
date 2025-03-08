// todo done: considered a union type but prefered clear splitting by usage

export interface Visit {
  id?: number,
  site: string,
  timeSpent: number,
  createdAt?: Date
}

export interface ButtonProps {
  selectedPeriod: string,
  setSelectedPeriod: function (string): void
}
  
export interface TabListProps {
  tabs: Visit[]
}