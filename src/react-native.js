import ReactNative from 'react-native'
import njsx from './njsx'
import RULES from './rules'

export const DEFAULT_REACT_NATIVE_RULES = [
  RULES.STRING_AS_CHILD,
  RULES.NUMBER_AS_CHILD,
  RULES.BOOLEAN_AS_CHILD,
  RULES.NJSX_COMPONENT_AS_CHILD,
  RULES.REACT_COMPONENT_AS_CHILD,
  RULES.HASH_AS_ATRIBUTES,
  RULES.IGNORE_NULL,
  RULES.IGNORE_UNDEFINED
]

njsx.rules = njsx.rules || DEFAULT_REACT_NATIVE_RULES

export const ActivityIndicator = njsx(ReactNative.ActivityIndicator)
export const Button = njsx(ReactNative.Button)
export const DatePickerIOS = njsx(ReactNative.DatePickerIOS)
export const DrawerLayoutAndroid = njsx(ReactNative.DrawerLayoutAndroid)
export const Image = njsx(ReactNative.Image)
export const KeyboardAvoidingView = njsx(ReactNative.KeyboardAvoidingView)
export const ListView = njsx(ReactNative.ListView)
export const MapView = (...args) => njsx(ReactNative.MapView)(args)
export const Modal = njsx(ReactNative.Modal)
export const Navigator = njsx(ReactNative.Navigator)
export const NavigatorIOS = njsx(ReactNative.NavigatorIOS)
export const Picker = njsx(ReactNative.Picker)
export const PickerIOS = njsx(ReactNative.PickerIOS)
export const ProgressBarAndroid = njsx(ReactNative.ProgressBarAndroid)
export const ProgressViewIOS = njsx(ReactNative.ProgressViewIOS)
export const RefreshControl = njsx(ReactNative.RefreshControl)
export const ScrollView = njsx(ReactNative.ScrollView)
export const SegmentedControlIOS = njsx(ReactNative.SegmentedControlIOS)
export const Slider = njsx(ReactNative.Slider)
export const SnapshotViewIOS = njsx(ReactNative.SnapshotViewIOS)
export const StatusBar = njsx(ReactNative.StatusBar)
export const Switch = njsx(ReactNative.Switch)
export const TabBarIOS = njsx(ReactNative.TabBarIOS)
export const TabBarIOSItem = njsx(ReactNative.TabBarIOS.Item)
export const Text = njsx(ReactNative.Text)
export const TextInput = njsx(ReactNative.TextInput)
export const ToolbarAndroid = njsx(ReactNative.ToolbarAndroid)
export const TouchableHighlight = njsx(ReactNative.TouchableHighlight)
export const TouchableNativeFeedback = njsx(ReactNative.TouchableNativeFeedback)
export const TouchableOpacity = njsx(ReactNative.TouchableOpacity)
export const TouchableWithoutFeedback = njsx(ReactNative.TouchableWithoutFeedback)
export const View = njsx(ReactNative.View)
export const ViewPagerAndroid = njsx(ReactNative.ViewPagerAndroid)