import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

import { utils } from '../../utils';
import { addToCalendar, x, plus, reset, play } from '../../images/svgs';
import ActionModal from '../modals/ActionModal';
import { userService } from '../../services/user.service';
import type { Card } from '../../interfaces/card.interfaces';

interface Props {
  item: Card;
  iconType?: 'next-lesson' | 'progress' | null;
  onResetProgress?: (id: number) => void;
  onRemoveFromMyList?: (id: number) => void;
}

const iconStyle = {
  height: 25,
  width: 25,
  fill: utils.color
};

export const CardIcon: React.FC<Props> = ({
  item: {
    id,
    published_on,
    is_added_to_primary_playlist,
    live_event_start_time,
    live_event_end_time,
    title
  },
  iconType,
  onResetProgress,
  onRemoveFromMyList
}) => {
  const [isAddedToPrimaryList, setIsAddedToPrimaryList] = useState(
    is_added_to_primary_playlist
  );
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAddToCalendarModal, setShowAddToCalendarModal] = useState(false);

  const addLessonToCalendar = useCallback(() => {
    const startDate = new Date(
      live_event_start_time || published_on
    ).toISOString();
    const endDate = new Date(live_event_end_time || published_on).toISOString();

    const eventConfig = {
      title: title,
      startDate,
      endDate
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(() => setShowAddToCalendarModal(false))
      .catch(() => setShowAddToCalendarModal(false));
  }, [live_event_start_time, live_event_end_time, title, published_on]);

  const addToMyList = useCallback(() => {
    setIsAddedToPrimaryList(true);
    userService.addToMyList(id);
  }, [setIsAddedToPrimaryList, id]);

  const removeFromMyList = useCallback(() => {
    setIsAddedToPrimaryList(false);
    userService.removeFromMyList(id);
    onRemoveFromMyList?.(id);
  }, [setIsAddedToPrimaryList, id]);

  const resetProgress = useCallback(() => {
    userService.resetProgress(id);
    onResetProgress?.(id);
  }, [id]);

  return (
    <View>
      {new Date(published_on) > new Date()
        ? addToCalendar({
            icon: iconStyle,
            container: styles.icon,
            onPress: () => setShowAddToCalendarModal(true)
          })
        : iconType === 'next-lesson'
        ? play({
            icon: iconStyle,
            container: { padding: 15 }
          })
        : iconType === 'progress'
        ? reset({
            icon: iconStyle,
            container: styles.icon,
            onPress: () => setShowResetModal(true)
          })
        : isAddedToPrimaryList
        ? x({
            icon: iconStyle,
            container: styles.icon,
            onPress: () => setShowRemoveModal(true)
          })
        : plus({
            icon: iconStyle,
            container: styles.icon,
            onPress: addToMyList
          })}
      {showRemoveModal && (
        <ActionModal
          title='Hold your horses...'
          message={`This will remove this lesson from\nyour list and cannot be undone.\nAre you sure about this?`}
          btnText='REMOVE'
          onAction={() => {
            setShowRemoveModal(false);
            removeFromMyList();
          }}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}
      {showResetModal && (
        <ActionModal
          title='Hold your horses...'
          message={`This will reset your progress\nand cannot be undone.\nAre you sure about this?`}
          btnText='RESET'
          onAction={() => {
            setShowResetModal(false);
            resetProgress();
          }}
          onCancel={() => setShowResetModal(false)}
        />
      )}
      {showAddToCalendarModal && (
        <ActionModal
          icon={addToCalendar({
            icon: { height: 128, width: 300, fill: utils.color }
          })}
          message={`Add this lesson to your calendar so you're notified when it's available`}
          btnText='ADD TO CALENDAR'
          onAction={() => {
            setShowAddToCalendarModal(false);
            addLessonToCalendar();
          }}
          onCancel={() => setShowAddToCalendarModal(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 15,
    paddingRight: 0
  }
});