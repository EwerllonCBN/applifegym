import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { useTheme, Box } from 'native-base'

import { AuthRoutes } from './auth.routes'

import { AppRoutes } from './app.routes'
import { Loading } from '@components/Loading'
import { useAuth } from '@hooks/useAuth'

export function Routes() {
  const { colors } = useTheme()
  const { isLoadingUserStorageData, user, signIn } = useAuth()

  const theme = DefaultTheme

  theme.colors.background = colors.gray[700]

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        {user?.uid ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
