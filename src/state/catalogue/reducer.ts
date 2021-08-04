import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Add, Reducer } from './interfaces';

export const SET_CATALOGUE_FROM_CACHE = 'SET_CATALOGUE_FROM_CACHE';
export const ADD_ALL = 'ADD_ALL';
export const ADD_NEW = 'ADD_NEW';
export const ADD_IN_PROGRESS = 'ADD_IN_PROGRESS';
export const ADD_RECENTLY_VIEWED = 'ADD_RECENTLY_VIEWED';
export const SET_METHOD = 'SET_METHOD';
export const SET_CATALOGUE_AND_CACHE = 'SET_CATALOGUE_AND_CACHE';
export const UPDATE_CATALOGUE = 'UPDATE_CATALOGUE';

const add: Add = (currentItem, nextItem) => [
  ...(currentItem || []),
  ...(nextItem || []).map(ni => ni.id)
];

export const catalogueReducer: Reducer = (
  state,
  {
    type,
    scene,
    all,
    newContent,
    inProgress,
    recentlyViewed,
    method,
    cache,
    refreshing,
    loadingMore
  }
) => {
  let newState = {
    ...state,
    refreshing: refreshing === undefined ? state.refreshing : refreshing,
    loadingMore: loadingMore === undefined ? state.loadingMore : loadingMore
  };
  switch (type) {
    case ADD_ALL:
      return { ...newState, all: add(newState.all, all) };
    case ADD_NEW:
      return { ...newState, newContent: add(newState.newContent, newContent) };
    case ADD_IN_PROGRESS:
      return { ...newState, inProgress: add(newState.inProgress, inProgress) };
    case ADD_RECENTLY_VIEWED:
      return {
        ...newState,
        recentlyViewed: add(newState.recentlyViewed, recentlyViewed)
      };
    case SET_METHOD:
      return { ...newState, method };
    case SET_CATALOGUE_AND_CACHE: {
      let cachedState = {
        all: (all || []).map(ni => ni.id),
        newContent: (newContent || []).map(ni => ni.id),
        inProgress: (inProgress || []).map(ni => ni.id),
        recentlyViewed: (recentlyViewed || []).map(ni => ni.id),
        method
      };
      AsyncStorage.setItem(`@${scene}`, JSON.stringify(cachedState));
      return { ...newState, ...cachedState };
    }
    case UPDATE_CATALOGUE:
      return newState;
    case SET_CATALOGUE_FROM_CACHE:
      return { ...newState, ...cache };
    default:
      return state;
  }
};
