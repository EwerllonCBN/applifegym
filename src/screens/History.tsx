import { useState } from 'react'
import { ScreenHeader } from '@components/ScreenHeader'
import { Heading, VStack, SectionList, Text } from 'native-base'
import { HistoryCard } from '@components/HistoryCard'

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: '26.06.23',
      data: ['Puxada frontal', 'Remada unilateral']
    },
    {
      title: '26.08.23',
      data: ['puxada frontal']
    }
  ])
  return (
    <VStack flex={1} bg="red">
      <ScreenHeader title="Histórico de exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            fontFamily="heading"
            color="gray.200"
            fontSize="md"
            mt={10}
            mb="3"
          >
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="gray.200" textAlign="center">
            Não há exercícios registrados ainda. {'\n'}Vamos treinar hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
