import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NumberContainer from "../components/game/NumberContainer";
import Card from "../components/ui/Card";
import InstructionText from "../components/ui/InstructionText";
import PrimaryButton from "../components/ui/PrimaryButton";
import Title from "../components/ui/Title";
import GuessLogItem from "../components/game/GuessLogItem";

const generateRandomNumber = (min, max, exclude) => {
  const randomNum = Math.floor(Math.random() * (max - min)) + min;

  if (randomNum === exclude) return generateRandomNumber(min, max, exclude);

  return randomNum;
};

let minBoundary = 1;
let maxBoundary = 100;

const GameScreen = ({ userNum, onGameOverHandler }) => {
  const initialGuess = generateRandomNumber(1, 100, userNum);
  const [currGuess, setCurrGuess] = useState(initialGuess);
  const [guessRounds, setGuessRounds] = useState([initialGuess]);

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (currGuess === userNum) onGameOverHandler(guessRounds.length);
  }, [currGuess, userNum, onGameOverHandler]);

  useEffect(() => {
    minBoundary = 1;
    maxBoundary = 100;
  }, []);

  const nextGuessHandler = (direction) => {
    if (
      (direction === "lower" && currGuess < userNum) ||
      (direction === "higher" && currGuess > userNum)
    ) {
      return Alert.alert("Don't lie!", "you know this is wrong...", [
        { text: "Sorry!", style: "cancel" },
      ]);
    }

    if (direction === "lower") {
      maxBoundary = currGuess;
    } else {
      minBoundary = currGuess + 1;
    }
    const newRandomNum = generateRandomNumber(
      minBoundary,
      maxBoundary,
      currGuess
    );
    setCurrGuess(newRandomNum);
    setGuessRounds((currGuesses) => [newRandomNum, ...currGuesses]);
  };

  const guessRoundsListLength = guessRounds.length;

  let content = (
    <>
      <NumberContainer>{currGuess}</NumberContainer>
      <View>
        <Card>
          <InstructionText extraStyles={{ marginBottom: 15 }}>
            Higher or Lower?
          </InstructionText>
          <View style={styles.btnsContainer}>
            <View style={styles.btnContainer}>
              <PrimaryButton onPress={() => nextGuessHandler("lower")}>
                <Ionicons name="md-remove" size={20} color="white" />
              </PrimaryButton>
            </View>
            <View style={styles.btnContainer}>
              <PrimaryButton onPress={() => nextGuessHandler("higher")}>
                <Ionicons name="md-add" size={20} color="white" />
              </PrimaryButton>
            </View>
          </View>
        </Card>
      </View>
    </>
  );

  if (width > 500) {
    content = (
      <>
        <View style={styles.btnsContainerWide}>
          <View style={styles.btnContainer}>
            <PrimaryButton onPress={() => nextGuessHandler("lower")}>
              <Ionicons name="md-remove" size={20} color="white" />
            </PrimaryButton>
          </View>
          <NumberContainer>{currGuess}</NumberContainer>
          <View style={styles.btnContainer}>
            <PrimaryButton onPress={() => nextGuessHandler("higher")}>
              <Ionicons name="md-add" size={20} color="white" />
            </PrimaryButton>
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={styles.screen}>
      <Title>Opponent's guess</Title>
      {content}
      {/* <View> */}
      {/* {guessRounds?.map((guessRound) => (
          <Text key={guessRound}>{guessRound}</Text>
        ))} */}
      {/* </View> */}
      <View style={styles.listContainer}>
        <FlatList
          data={guessRounds}
          renderItem={(itemData) => (
            <GuessLogItem
              roundNumber={guessRoundsListLength - itemData.index}
              guess={itemData.item}
            />
          )}
          keyExtractor={(item) => item}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  btnsContainer: {
    flexDirection: "row",
  },
  btnContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  btnsContainerWide: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default GameScreen;
