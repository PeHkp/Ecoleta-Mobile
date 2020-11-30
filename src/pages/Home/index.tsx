import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { RectButton } from "react-native-gesture-handler";

import RNPickerSelect from "react-native-picker-select";

import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const navigation = useNavigation();

  const [selectedUf, setselectedUf] = useState("0");

  const [selectedCity, setselectedCity] = useState("0");

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufinitials = response.data.map((uf) => uf.sigla);

        setUfs(ufinitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);

        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleNavigateToPoint() {
    navigation.navigate("Points",{
      selectedUf,
      selectedCity
    });
  }

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <View>
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RNPickerSelect
          value={selectedUf}
          style={styles}
          placeholder={{
            label: "Selecione sua UF",
            value: selectedUf,
          }}
          onValueChange={(value) => {
            setselectedUf(value);

            console.log(selectedUf);
          }}
          items={ufs.map((uf) => ({ label: uf, value: uf }))}
        />
        <RNPickerSelect
          value={selectedCity}
          style={styles}
          placeholder={{
            label: "Selecione sua cidade",
            value: selectedCity,
          }}
          onValueChange={(value) => {
            setselectedCity(value);
            console.log(selectedCity);
          }}
          items={cities.map((city) => ({ label: city, value: city }))}
        />

        <RectButton style={styles.button} onPress={handleNavigateToPoint}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24}></Icon>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#7a33cc",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputIOS: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
