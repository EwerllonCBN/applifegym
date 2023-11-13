import { HStack, Heading, Text, VStack, Icon } from 'native-base'

import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'
import { useAuth } from '@hooks/useAuth'
import { UserPhoto } from './UserPhoto'
export function HomeHeader() {
  const { user, handleSignOut } = useAuth()
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={user?.photoURL ? { uri: user.photoURL } : defaultUserPhotoImg}
        size={16}
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading
          numberOfLines={1}
          ellipsizeMode="tail"
          color="gray.100"
          fontSize="md"
          fontFamily="heading"
        >
          {user?.displayName}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}
