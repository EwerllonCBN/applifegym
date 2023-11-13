import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import {
  Center,
  ScrollView,
  Text,
  VStack,
  Skeleton,
  Divider,
  Heading,
  KeyboardAvoidingView,
  useToast
} from 'native-base'
import { useState } from 'react'
import { Platform, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { auth } from '@services/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAuth } from '@hooks/useAuth'

const PHOTO_SIZE = 33

type dataProps = {
  email: string
}

const updatePasswordScheme = yup.object({
  email: yup
    .string()
    .required('Informe seu e-email para redefinir sua senha')
    .email('E-mail inválido.')
})

export function Profile() {
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState(
    'https://w7.pngwing.com/pngs/86/421/png-transparent-computer-icons-user-profile-set-of-abstract-icon-miscellaneous-monochrome-computer-wallpaper.png'
  )

  const { user } = useAuth()

  const toast = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<dataProps>({ resolver: yupResolver(updatePasswordScheme) })

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grante. Escolha uma de até 5MB',
            placement: 'top',
            bgColor: 'red.500'
          })
        }
        setUserPhoto(photoSelected.assets[0].uri)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleForgotPassword({ email }: dataProps) {
    let title = ''
    try {
      setIsLoading(true)
      await sendPasswordResetEmail(auth, email)
      if (email === user?.email) {
        title = 'E-mail de redefinição de senha enviado com sucesso.'

        toast.show({
          title,
          placement: 'top',
          size: '2',
          bgColor: 'green.500'
        })
      } else {
        title = 'Ops! Verifique se o e-mail está correto.'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <KeyboardAvoidingView
        flex={1}
        enabled={Platform.OS === 'ios' ? true : false}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
          <Center mt={6} px={10}>
            {photoIsLoading ? (
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.600"
                endColor="gray.400"
              />
            ) : (
              <UserPhoto source={{ uri: userPhoto }} size={33} />
            )}
            <TouchableOpacity onPress={handleUserPhotoSelect}>
              <Text
                color="green.500"
                fontWeight="bold"
                fontSize="md"
                mt={2}
                mb={8}
              >
                Alterar foto
              </Text>
            </TouchableOpacity>

            <VStack flex={1} justifyContent="initial">
              <Heading
                numberOfLines={1}
                ellipsizeMode="tail"
                color="gray.100"
                fontSize="xl"
                fontFamily="heading"
              >
                {user?.displayName}
              </Heading>
            </VStack>

            <Divider
              _light={{
                bg: 'gray.500'
              }}
              _dark={{
                bg: 'gray.300'
              }}
              mt={6}
            />

            <Heading
              fontFamily="heading"
              color="gray.200"
              fontSize="md"
              mb={2}
              alignSelf="flex-start"
              mt={4}
            >
              Alterar senha
            </Heading>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  errorMessage={errors.email?.message}
                  placeholder={user?.email as string}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  bg="gray.600"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Button
              isLoading={isLoading}
              onPress={handleSubmit(handleForgotPassword)}
              title="Redefinir senha"
              mt={4}
            />
          </Center>
        </ScrollView>
      </KeyboardAvoidingView>
    </VStack>
  )
}
