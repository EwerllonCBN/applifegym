import { useEffect, useState } from 'react'
import {
  Center,
  Heading,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  VStack,
  useToast
} from 'native-base'

import BackgroundImg from '@assets/background.png'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { auth, db } from '@services/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { UserDTO } from '@dtos/UserDTO'
import { useAuth } from '@hooks/useAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'

type FormDataProps = {
  name: string
  email: string
  password: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Senha é obrigatória.')
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
})

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const { user, updateUser, handleSignUp } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  const toast = useToast()

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  async function createUserCollection(user: UserDTO) {
    try {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'local',
        email: user.email
      })
    } catch (error) {
      console.error('Erro ao criar coleção de usuário:', error)
    }
  }

  async function handleCreateUserAccount({
    name,
    email,
    password
  }: FormDataProps) {
    try {
      setIsLoading(true)
      const newUser = await handleSignUp(name, email, password)

      if (user && user.uid) {
        toast.show({
          title: 'Usuário criado com sucesso!',
          placement: 'top',
          bgColor: 'green.500'
        })
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        let title = ''
        switch (error.code) {
          case 'auth/email-already-in-use':
            title = 'E-mail já em uso.'
            break
          case 'auth/invalid-email':
            title = 'E-mail inválido.'
            break
          case 'auth/weak-password':
            title = 'Senha fraca. A senha deve ter pelo menos 6 caracteres.'
            break
          default:
            title = `Erro ao criar conta de usuário: ${error.message}`
            break
        }

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        })

        throw error
      } else {
        console.error('Erro desconhecido ao criar conta de usuário:', error)
        throw error
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.displayName) {
      setName(user.displayName)

      createUserCollection({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      })
    }
  }, [])

  return (
    <KeyboardAvoidingView
      flex={1}
      enabled={Platform.OS === 'ios' ? true : false}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} flexDir="column" justifyContent="space-between" px={5}>
          <Image
            //DefaultSource define por padrão uma imagem a ser carregada
            //Ao renderizar a página, isso ajuda no carregamento mais rápido da imagem
            source={BackgroundImg}
            alt="Pessoas treinando"
            resizeMode="contain"
            position="absolute"
            defaultSource={BackgroundImg}
          />
          <Center my={10}>
            <Text color="gray.100" fontSize={50} fontFamily="heading">
              LIF<Text color="green.500">E</Text> GYM
            </Text>
            <Text color="gray.100" fontSize="sm">
              Treine sua mente e seu corpo
            </Text>
          </Center>
          <Center>
            <Heading color="gray.100" fontSize="xl" mb={5} fontFamily="heading">
              Crie sua conta
            </Heading>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  autoCorrect={false}
                  errorMessage={errors.password?.message}
                />
              )}
            />
          </Center>
          <VStack w="full">
            <Button
              title="Criar e acessar"
              onPress={handleSubmit(handleCreateUserAccount)}
              mb={5}
              isLoading={isLoading}
            />
            <Button
              variant="outline"
              title="Voltar para o login"
              mb={5}
              onPress={handleGoBack}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
