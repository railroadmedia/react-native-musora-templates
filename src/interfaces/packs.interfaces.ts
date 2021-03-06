import type { Card } from './card.interfaces';
import type { Resource } from './lesson.interfaces';

export interface Pack {
  id: number;
  type: string;
  title: string;
  price: string;
  is_new: boolean;
  pack_logo: string;
  started: boolean;
  completed: boolean;
  thumbnail: string;
  thumbnail_url: string;
  is_locked: boolean;
  mobile_app_url: string;
  bundle_count: number;
  progress_percent: number;
  published_on: string;
  is_owned: boolean;
  full_price: string;
  description: string;
  is_added_to_primary_playlist: boolean;
  current_lesson_index: number;
  next_lesson: Card;
  resources: Resource[];
}

export interface BannerPack extends Pack {
  next_lesson_url: string;
}

export interface PackBundle extends Pack {
  bundles: PackLessonBundle[];
  bundle_number: number;
}

export interface PackLessonBundle extends Pack {
  lessons: Card[];
  lesson_count: number;
}
