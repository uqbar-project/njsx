import ReactNative from 'react-native'
import njsx from './njsx'
import RULES from './rules'
const {entries, assign} = Object

export const DEFAULT_REACT_NATIVE_RULES = [
  RULES.STRING_AS_CHILD,
  RULES.NUMBER_AS_CHILD,
  RULES.BOOLEAN_AS_CHILD,
  RULES.STYLE_AS_STYLE,
  RULES.NJSX_COMPONENT_AS_CHILD,
  RULES.REACT_COMPONENT_AS_CHILD,
  RULES.HASH_AS_ATRIBUTES,
  RULES.IGNORE_NULL,
  RULES.IGNORE_UNDEFINED
]

njsx.rules = njsx.rules || DEFAULT_REACT_NATIVE_RULES

export const StyleSheet = {
  create(styleDefinition) {
    return entries(ReactNative.StyleSheet.create(styleDefinition)).reduce((acum, [key, value]) =>
      assign(acum, {[key]: {styleId: value}} )
    , {})
  }
}

export const ActivityIndicator = (...args) => njsx(ReactNative.ActivityIndicator)(...args)
export const Button = (...args) => njsx(ReactNative.Button)(...args)
export const DatePickerIOS = (...args) => njsx(ReactNative.DatePickerIOS)(...args)
export const DrawerLayoutAndroid = (...args) => njsx(ReactNative.DrawerLayoutAndroid)(...args)
export const Image = (...args) => njsx(ReactNative.Image)(...args)
export const KeyboardAvoidingView = (...args) => njsx(ReactNative.KeyboardAvoidingView)(...args)
export const ListView = (...args) => njsx(ReactNative.ListView)(...args)
export const MapView = (...args) => njsx(ReactNative.MapView)(...args)
export const Modal = (...args) => njsx(ReactNative.Modal)(...args)
export const Navigator = (...args) => njsx(ReactNative.Navigator)(...args)
export const NavigatorIOS = (...args) => njsx(ReactNative.NavigatorIOS)(...args)
export const Picker = (...args) => njsx(ReactNative.Picker)(...args)
export const PickerIOS = (...args) => njsx(ReactNative.PickerIOS)(...args)
export const ProgressBarAndroid = (...args) => njsx(ReactNative.ProgressBarAndroid)(...args)
export const ProgressViewIOS = (...args) => njsx(ReactNative.ProgressViewIOS)(...args)
export const RefreshControl = (...args) => njsx(ReactNative.RefreshControl)(...args)
export const ScrollView = (...args) => njsx(ReactNative.ScrollView)(...args)
export const SegmentedControlIOS = (...args) => njsx(ReactNative.SegmentedControlIOS)(...args)
export const Slider = (...args) => njsx(ReactNative.Slider)(...args)
export const SnapshotViewIOS = (...args) => njsx(ReactNative.SnapshotViewIOS)(...args)
export const StatusBar = (...args) => njsx(ReactNative.StatusBar)(...args)
export const Switch = (...args) => njsx(ReactNative.Switch)(...args)
export const TabBarIOS = (...args) => njsx(ReactNative.TabBarIOS)(...args)
export const TabBarIOSItem = (...args) => njsx(ReactNative.TabBarIOS.Item)(...args)
export const Text = (...args) => njsx(ReactNative.Text)(...args)
export const TextInput = (...args) => njsx(ReactNative.TextInput)(...args)
export const ToolbarAndroid = (...args) => njsx(ReactNative.ToolbarAndroid)(...args)
export const TouchableHighlight = (...args) => njsx(ReactNative.TouchableHighlight)(...args)
export const TouchableNativeFeedback = (...args) => njsx(ReactNative.TouchableNativeFeedback)(...args)
export const TouchableOpacity = (...args) => njsx(ReactNative.TouchableOpacity)(...args)
export const TouchableWithoutFeedback = (...args) => njsx(ReactNative.TouchableWithoutFeedback)(...args)
export const View = (...args) => njsx(ReactNative.View)(...args)
export const ViewPagerAndroid = (...args) => njsx(ReactNative.ViewPagerAndroid)(...args)