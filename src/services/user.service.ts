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
  updateAvatar: function (file) {
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
  updateUserDetails: function (picture, name) {
    let url = `/musora-api/profile/update?`;
    if (picture) url += `file=${picture}`;
    if (name) url += `display_name=${name}`;
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
  }
};
