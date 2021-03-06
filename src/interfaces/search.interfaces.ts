export interface SearchState {
  searchResult?: number[];
  refreshing: boolean;
  loadingMore: boolean;
}
export interface AddSearch {
  (
    currentItem: number[] | undefined,
    nextItem: { id: number }[] | undefined
  ): number[];
}

interface SearchAction {
  type: string;
  searchResult?: { id: number }[];
  refreshing?: boolean;
  loadingMore?: boolean;
}
export interface SearchReducer {
  (state: SearchState, action: SearchAction): SearchState;
}
