import {
  createBottomTabNavigator,
  BottomTabNavigationProp
} from '@react-navigation/bottom-tabs'

import { Home } from '@screens/Home'
import { Exercise } from '@screens/Exercise'
import { History } from '@screens/History'
import { Profile } from '@screens/Profile'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import ProfileSvg from '@assets/profile.svg'
import { useTheme } from 'native-base'
import { Platform } from 'react-native'

type AppRoutesType = {
  home: undefined
  history: undefined
  profile: undefined
  exercise: { exerciseId: string }
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesType>()

export function AppRoutes() {
  const { sizes, colors } = useTheme()
  const iconSize = sizes[7]
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 70,
          paddingTop: sizes[6],
          paddingBottom: sizes[6]
        }
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          )
        }}
      />
      <Screen
        name="history"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          )
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          )
        }}
      />
      <Screen
        name="exercise"
        component={Exercise}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  )
}
