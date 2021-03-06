import { call } from './auth.service';
import { utils } from '../utils';
import type { UserService } from '../interfaces/service.interfaces';

export const userService: UserService = {
  getUserDetails: function (args) {
    return call({ url: `/musora-api/profile`, signal: args?.signal });
  },
  getNotifications: function ({ page, signal }) {
    return call({
      url: `/api/railnotifications/notifications?limit=10&page=${page}`,
      signal
    });
  },
  changeNotificationSettings: function (body) {
    return call({
      url: `/usora/api/profile/update`,
      method: 'POST',
      body
    });
  },
  updateAvatar: async function (file) {
    const data = new FormData();
    if (file) {
      data.append('file', {
        name: file.fileName || 'avatar',
        type: file.type,
        uri: utils.isiOS ? file.uri?.replace('file://', '') : file.uri
      });
      data.append('target', file.fileName || 'avatar');
    }
    return call({
      url: `/musora-api/avatar/upload`,
      method: 'POST',
      body: data
    });
  },
  updateUserDetails: function ({ picture, name, phone }) {
    let url = `/musora-api/profile/update?`;
    if (picture) url += `file=${picture}`;
    if (name) url += `display_name=${name}`;
    if (phone) url += `phone_number=${phone}`;
    return call({ url, method: 'POST' });
  },
  isNameUnique: function (name) {
    return call({
      url: `/usora/api/is-display-name-unique?display_name=${name}`
    });
  },
  addToMyList: function (id) {
    return call({
      url: `/api/railcontent/add-to-my-list?content_id=${id}`,
      method: 'PUT'
    });
  },
  removeFromMyList: function (id) {
    return call({
      url: `/api/railcontent/remove-from-my-list?content_id=${id}`,
      method: 'PUT'
    });
  },
  resetProgress: function (id) {
    return call({
      url: `/musora-api/reset?content_id=${id}`,
      method: 'PUT'
    });
  },
  likeContent: function (id) {
    return call({
      url: `/api/railcontent/content-like?content_id=${id}`,
      method: 'PUT'
    });
  },
  dislikeContent: function (id) {
    return call({
      url: `/api/railcontent/content-like?content_id=${id}`,
      method: 'DELETE'
    });
  },
  updateUsersSoundsliceProgress: function (
    session_id: number,
    mediaId: number,
    currentSecond: number,
    mediaLengthSeconds: number
  ) {
    return call({
      url: `/musora-api/media/${session_id}?media_type=assignment&media_category=soundslice&media_id=${mediaId}&length_in_seconds=${mediaLengthSeconds}&seconds_played=${currentSecond}&current_second=${currentSecond}`,
      method: 'PUT'
    });
  },
  markAsComplete: function (id: number) {
    return call({
      url: `/musora-api/complete?content_id=${id}&device_type=${
        utils.isiOS ? 'ios' : 'android'
      }`,
      method: 'PUT'
    });
  },
  updateUsersVideoProgress: function (
    id: number,
    seconds: number,
    lengthInSeconds: number,
    media_id: number,
    media_category: string,
    media_type: string
  ) {
    return call({
      url: `/musora-api/media/${id}?seconds_played=${seconds}&current_second=${seconds}&length_in_seconds=${lengthInSeconds}&media_id=${media_id}&media_category=${media_category}&media_type=${media_type}`,
      method: 'PUT'
    });
  },
  getMediaSessionId: async function (
    media_id,
    content_id,
    length_in_seconds,
    media_category,
    media_type
  ) {
    return call({
      url: `/musora-api/media?media_category=${media_category}&media_id=${media_id}&content_id=${content_id}&media_length_seconds=${length_in_seconds}&media_type=${media_type}`,
      method: 'PUT'
    });
  }
};
