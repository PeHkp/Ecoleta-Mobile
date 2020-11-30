import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import { Feather as Icon } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

import api from "../../services/api";

import * as MailComposer from "expo-mail-composer";

interface Params {
  point_id: number;
}
interface Data {
  point: {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [data, setData] = useState<Data>({} as Data);

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then((res) => {
      setData(res.data);
    });
  }, []);

  function handleNavegateBack() {
    navigation.goBack();
  }

  function handleComposeEmail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    })
  }
  function handleWhatsApp() {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text= Tenho interesse sobre coleta de resíduos`)
  }

  if (!data.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavegateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: data.point.image,
          }}
        ></Image>
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(", ")}
          </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereco</Text>
          <Text style={styles.addressContent}>{data.point.city},  {data.point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton onPress={handleWhatsApp} style={styles.button}>
          <FontAwesome
            style={styles.buttonText}
            name="whatsapp"
            size={20}
            color={"#fff"}
          >
            {" "}
            WhatsApp
          </FontAwesome>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeEmail}>
          <Icon style={styles.buttonText} name="mail" size={20} color={"#fff"}>
            {" "}
            E-mail
          </Icon>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: "#7a33cc",
    fontSize: 28,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  pointItems: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: "#7a33cc",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  addressContent: {
    fontFamily: "Roboto_400Regular",
    lineHeight: 24,
    marginTop: 8,
    color: "#6C6C80",
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#999",
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    width: "48%",
    backgroundColor: "#34CB79",
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 0,
    color: "#FFF",
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
  },
});

export default Detail;
