[AUTHOR]: https://github.com/rozhkovs
[FEEDBACK_GITHUB]: https://github.com/quidone/react-native-wheel-picker-feedback
[EXPO_SNACK]: https://snack.expo.dev/@sergeyrozhkov/quidone-react-native-wheel-picker

# React Native Wheel Picker
<p>
  <a href="https://github.com/quidone/react-native-wheel-picker/blob/HEAD/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="React Native Wheel Picker is released under the MIT license." />
  </a>
  <a href="https://github.com/quidone/react-native-wheel-picker/actions/workflows/tests.yml">
    <img src="https://github.com/quidone/react-native-wheel-picker/actions/workflows/tests.yml/badge.svg" alt="CI Tests" />
  </a>
  <a href="https://www.npmjs.com/package/@quidone/react-native-wheel-picker">
    <img src="https://img.shields.io/npm/v/@quidone/react-native-wheel-picker?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
  <a href="https://www.npmjs.com/package/@quidone/react-native-wheel-picker">
    <img src="https://img.shields.io/npm/dw/@quidone/react-native-wheel-picker" alt="Number of downloads per week." />
  </a>
</p>

A flexible React Native Wheel Picker for iOS and Android without using the native side.

<table>
  <tr>
    <td align="center">
      <img src="./docs/images/simple-picker-ios.gif" height="200"/>
      <br />
      On iOS
    </td>
    <td align="center">
      <img src="./docs/images/simple-picker-android.gif" height="200"/>
      <br />
      On Android
    </td>
    <td align="center">
      <img src="./docs/images/customized-picker.gif" height="200"/>
      <br />
      Customization
    </td>
  </tr>
</table>


## Features
 - Without native side.
 - Unified API.
 - Only native animations.
 - [Support native feedback](#Native-Feedback).
 - [Support virtualization](#withVirtualized).
 - Compatible with Expo ([Snack][EXPO_SNACK]).
 - Deep customization
 - Written ```TypeScript```.

## Installation
```shell
yarn add @quidone/react-native-wheel-picker
```

## Navigation

- [Usage](#Usage)
- [Native Feedback](#Native-Feedback)
- [API](#API)
  - [WheelPicker](#WheelPicker)
  - [usePickerItemHeight](#usePickerItemHeight)
  - [useScrollContentOffset](#useScrollContentOffset)
  - [withVirtualized](#withVirtualized)
- [Footer](#-Author)

## Usage

### [🚀 Expo Snack example][EXPO_SNACK]

If you want to see more examples and experiment, run the examples locally.

```shell
git clone git@github.com:quidone/react-native-wheel-picker.git
cd react-native-wheel-picker
yarn install
cd example && yarn install && yarn ios
```

### Simple case

```jsx
import React, {useState} from 'react';
import WheelPicker from '@quidone/react-native-wheel-picker';

const data = [...Array(100).keys()].map((index) => ({
  value: index,
  label: index.toString(),
}))

const App = () => {
  const [value, setValue] = useState(0);
  return (
    <WheelPicker
      data={data}
      value={value}
      onValueChanged={({item: {value}}) => setValue(value)}
      enableScrollByTapOnItem={true}
    />
  );
};

export default App;
```

## Native Feedback

You can trigger native sound and impact with [@quidone/react-native-wheel-picker-feedback][FEEDBACK_GITHUB]
and onValueChanging event

```jsx
// ...
import WheelPickerFeedback from '@quidone/react-native-wheel-picker-feedback';

const App = () => {
  return (
    <WheelPicker
      onValueChanging={() => {
        WheelPickerFeedback.triggerSoundAndImpact();
      }}
    />
  );
};
```

## API

### WheelPicker

#### Props
- ```data``` [array] - items of picker
- ```value?``` [any] - current value of picker item
- ```itemHeight?``` [number] - height of picker item in the center.
- ```visibleItemCount?``` [number] - number of displayed items: 1, 3, 5... (default = 5). For 5, the WheelPicker height is calculated incorrectly, left for backward compatibility.
- ```width?``` [number | string] - width of picker.
- ```readOnly?``` [boolean] - read only mode.
- ```enableScrollByTapOnItem?``` [boolean] - allow scrolling by tap on an item (default = false)
- ```testID?``` [string] - Used to locate this component in end-to-end tests.
- ```onValueChanging?``` [function] - An event that is triggered when the value is changing.
- ```onValueChanged?``` [function] - An event that is triggered when the value is changed (wheel is stopped and no touch).
- ```keyExtractor?``` [function] - key extractor from picker item.
- ```renderItem?``` [function] - render picker item content.
- ```renderItemContainer?``` [function] - render picker item container (there is animated container).
- ```renderOverlay?``` [function | null] - render overlay over the picker.
- ```renderList?``` [function] - render list (Advanced, It is not recommended to use).
- ```style?``` [object | array] - root style.
- ```itemTextStyle?``` [object | array] - item text style for picker item.
- ```overlayItemStyle?``` [object | array] - style for the overlay element in the center
- ```contentContainerStyle?``` [object | array] - style which wraps all of the child views [original](https://reactnative.dev/docs/scrollview#contentcontainerstyle)
- ```scrollEventThrottle?``` [object | array] - [original](https://reactnative.dev/docs/scrollview#scrolleventthrottle-ios)


### usePickerItemHeight
This hook returns the item height which was passed via props.

### useScrollContentOffset
This hook returns the animated value of the ScrollView offset.

### withVirtualized
This HOC returns virtualized picker

```jsx
import WheelPicker, {withVirtualized} from '@quidone/react-native-wheel-picker';

const VirtualizedWheelPicker = withVirtualized(WheelPicker);
```

#### Additional props
- ```initialNumToRender?``` (default = ```Math.ceil(visibleItemCount / 2)```) - [original](https://reactnative.dev/docs/flatlist#initialnumtorender).
- ```maxToRenderPerBatch?``` (default = ```Math.ceil(visibleItemCount / 2)```) - [original](https://reactnative.dev/docs/flatlist#maxtorenderperbatch).
- ```windowSize?``` - [original](https://reactnative.dev/docs/flatlist#windowsize).
- ```updateCellsBatchingPeriod?``` (default = 10) - [original](https://reactnative.dev/docs/flatlist#updatecellsbatchingperiod).

## 👨‍💻 Author
[Sergey Rozhkov][AUTHOR]

## 🎯 Was it helpful?
Do you like it and find it helpful? You can help this project in the following way:
- ⭐ Put the star.
- 💡 Suggest your ideas.
- 😉 Open a founded issue.

## 🤝 Contributing
See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 📄 License
Quidone React Native Wheel Picker is MIT licensed, as found in the [LICENSE](LICENSE) file.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
