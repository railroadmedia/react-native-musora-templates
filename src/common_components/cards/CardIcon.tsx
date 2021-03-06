import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { View, StyleSheet } from 'react-native';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

import { utils } from '../../utils';
import { addToCalendar, x, plus, reset, play } from '../../images/svgs';
import { ActionModal } from '../modals/ActionModal';
import { userService } from '../../services/user.service';
import type { Card } from '../../interfaces/card.interfaces';
import { ConnectionContext } from '../../state/connection/ConnectionContext';
import { Download_V2 } from 'RNDownload';
import { themeStyles } from '../../themeStyles';
import { ThemeContext } from '../../state/theme/ThemeContext';
import { CardsContext } from '../../state/cards/CardsContext';

interface Props {
  item: Card;
  iconType?: 'next-lesson' | 'progress' | 'downloads';
  onResetProgress?: (id: number) => void;
  onRemoveFromMyList?: (id: number) => void;
}

export const CardIcon: React.FC<Props> = ({
  item,
  iconType,
  onResetProgress,
  onRemoveFromMyList
}) => {
  const {
    id,
    published_on,
    is_added_to_primary_playlist,
    live_event_start_time,
    live_event_end_time,
    title
  } = item;

  const iconStyle = useMemo(() => {
    return {
      height: 25,
      width: 25,
      fill: utils.color
    };
  }, []);

  const { isConnected, showNoConnectionAlert } = useContext(ConnectionContext);
  const { updateCard } = useContext(CardsContext);

  const { theme } = useContext(ThemeContext);
  const removeModalRef = useRef<React.ElementRef<typeof ActionModal>>(null);
  const resetModalRef = useRef<React.ElementRef<typeof ActionModal>>(null);
  const calendarModalRef = useRef<React.ElementRef<typeof ActionModal>>(null);

  const addLessonToCalendar = useCallback(() => {
    if (!isConnected) return showNoConnectionAlert();

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
      .then(() => calendarModalRef.current?.toggle())
      .catch(() => calendarModalRef.current?.toggle());
  }, [
    live_event_start_time,
    live_event_end_time,
    title,
    published_on,
    calendarModalRef,
    isConnected
  ]);

  const addToMyList = useCallback(() => {
    if (!isConnected) return showNoConnectionAlert();

    updateCard({ ...item, is_added_to_primary_playlist: true });
    userService.addToMyList(id);
  }, [id, isConnected]);

  const removeFromMyList = useCallback(() => {
    if (!isConnected) return showNoConnectionAlert();

    removeModalRef.current?.toggle();
    updateCard({ ...item, is_added_to_primary_playlist: false });
    userService.removeFromMyList(id);
    onRemoveFromMyList?.(id);
  }, [id, removeModalRef, isConnected]);

  const resetProgress = useCallback(() => {
    if (!isConnected) return showNoConnectionAlert();

    resetModalRef.current?.toggle();
    updateCard({ ...item, progress_percent: 0, completed: false });
    userService.resetProgress(id);
    onResetProgress?.(id);
  }, [id, resetModalRef, isConnected]);

  return (
    <View>
      {iconType === 'downloads' ? (
        <View style={styles.downloadBtnContainer}>
          <Download_V2
            entity={item}
            styles={{
              touchable: { flex: 1 },
              iconDownloadColor: utils.color,
              activityIndicatorColor: utils.color,
              animatedProgressBackground: utils.color,
              alert: {
                alertTextMessageFontFamily: 'OpenSans',
                alertTouchableTextDeleteColor: 'white',
                alertTextTitleColor: themeStyles[theme].textColor,
                alertTextMessageColor: themeStyles[theme].textColor,
                alertTextTitleFontFamily: 'OpenSans-Bold',
                alertTouchableTextCancelColor: utils.color,
                alertTouchableDeleteBackground: utils.color,
                alertBackground: themeStyles[theme].background,
                alertTouchableTextDeleteFontFamily: 'OpenSans-Bold',
                alertTouchableTextCancelFontFamily: 'OpenSans-Bold'
              }
            }}
          />
        </View>
      ) : new Date(published_on) > new Date() ? (
        addToCalendar({
          icon: iconStyle,
          container: styles.icon,
          onPress: () =>
            calendarModalRef.current?.toggle(
              ' ',
              `Add this lesson to your calendar so you're notified when it's available`
            )
        })
      ) : iconType === 'next-lesson' ? (
        play({
          icon: iconStyle,
          container: { padding: 15 }
        })
      ) : iconType === 'progress' ? (
        reset({
          icon: iconStyle,
          container: styles.icon,
          onPress: () =>
            resetModalRef.current?.toggle(
              'Hold your horses...',
              `This will reset your progress\nand cannot be undone.\nAre you sure about this?`
            )
        })
      ) : is_added_to_primary_playlist ? (
        x({
          icon: iconStyle,
          container: styles.icon,
          onPress: () =>
            removeModalRef.current?.toggle(
              'Hold your horses...',
              `This will remove this lesson from\nyour list and cannot be undone.\nAre you sure about this?`
            )
        })
      ) : (
        plus({
          icon: iconStyle,
          container: styles.icon,
          onPress: addToMyList
        })
      )}
      <ActionModal
        ref={removeModalRef}
        primaryBtnText='REMOVE'
        onAction={removeFromMyList}
        onCancel={() => removeModalRef.current?.toggle()}
      />
      <ActionModal
        ref={resetModalRef}
        primaryBtnText='RESET'
        onAction={resetProgress}
        onCancel={() => resetModalRef.current?.toggle()}
      />

      <ActionModal
        ref={calendarModalRef}
        icon={addToCalendar({
          icon: { height: 128, width: 300, fill: utils.color }
        })}
        primaryBtnText='ADD TO CALENDAR'
        onAction={addLessonToCalendar}
        onCancel={() => calendarModalRef.current?.toggle()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 15,
    paddingRight: 0
  },
  downloadBtnContainer: {
    width: 43,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
