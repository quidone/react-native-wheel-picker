import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {DatePicker} from '@quidone/react-native-wheel-picker';

interface DatePickerBottomSheetProps {
  initialDate: string;
  onDateConfirmed: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  visibleItemCount?: number;
}

export interface DatePickerBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const DatePickerBottomSheet = forwardRef<
  DatePickerBottomSheetRef,
  DatePickerBottomSheetProps
>(
  (
    {initialDate, onDateConfirmed, minDate, maxDate, visibleItemCount = 5},
    ref,
  ) => {
    const insets = useSafeAreaInsets();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    useImperativeHandle(ref, () => ({
      open: () => {
        setSelectedDate(initialDate);
        bottomSheetRef.current?.present();
      },
      close: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const onDateChanged = useStableCallback(({date}: {date: string}) => {
      setSelectedDate(date);
    });

    const handleDone = useCallback(() => {
      onDateConfirmed(selectedDate);
      bottomSheetRef.current?.close();
    }, [selectedDate, onDateConfirmed]);

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        enableDynamicSizing={true}
        enableContentPanningGesture={false}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.pickerContainer,
              {paddingBottom: Math.max(insets.bottom, 20)},
            ]}
          >
            <DatePicker
              date={selectedDate}
              onDateChanged={onDateChanged}
              minDate={minDate}
              maxDate={maxDate}
              visibleItemCount={visibleItemCount}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  doneButton: {
    padding: 8,
  },
  doneText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    alignItems: 'center',
    padding: 16,
  },
});
