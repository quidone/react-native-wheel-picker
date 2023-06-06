import type {PickerItem} from '@quidone/react-native-wheel-picker';

export type CusPickerItem = PickerItem<{
  firstName: string;
  lastName: string;
  job: string;
  avatarUrl: string;
}>;
