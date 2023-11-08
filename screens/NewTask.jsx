import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthProvider";
import { TextInput, Button } from "react-native-paper";
import axiosConfig from "../helpers/axiosConfig";
import { Chip} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function NewTask({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState(new Date());
 
  const [userExecute, setUserExecute] = useState(null);
  const [selectedExecute, setSelectedExecute] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  useEffect(() => {
    getExecute();
  }, []);

  function sendTask(idExecute) {
    console.log(idExecute);
    console.log("sending");
    setIsLoadingButton(true);
    if (idExecute == null) {
      Alert.alert("Falta seleccionar la persona que ejecuta la tarea");
    }
    const task = {
      title,
      description,
      expiration_date: expirationDate.toISOString().split("T")[0],
      user_execute_id: idExecute,
    };

    axiosConfig
      .post(`/tasks`, task)
      .then((response) => {
        Alert.alert("Tarea agregada con exito");
        navigation.navigate("Home1", {
          newTaskAdded: response.data,
        });
        setIsLoadingButton(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingButton(false);
      });
  }

  function getExecute() {
    axiosConfig
      .get(`/user/list-execute`)
      .then((response) => {
        console.log(response.data.userData);
        setUserExecute(response.data.userData);
        setIsLoading(false);
        setIsLoadingButton(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsLoadingButton(false);
      });
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Titulo"
            placeholderTextColor="gray"
          />

          <TextInput
            style={styles.input}
            label="Descripción"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={{marginTop:20}}>Seleccionar el día de vencimiento de la tarea</Text>
             <Chip icon="calendar" style={{backgroundColor:'#cccccc', marginTop:20}} selectedColor="white">
                  {expirationDate.toISOString().split("T")[0]}
            </Chip>
          </TouchableOpacity>
         
          {showDatePicker && (
            <DateTimePicker
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (event.type === "set") {
                  setExpirationDate(date);
                }
                setShowDatePicker(false);
              }}
              value={expirationDate}
            />
          )}
          <Text style={{ marginTop: 20 }}>
            Asignar una persona que ejecutará la tarea
          </Text>
          <Picker
            selectedValue={selectedExecute}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedExecute(itemValue);
            }}
          >
            <Picker.Item label="Seleccionar persona" value={null} key={0} />
            {userExecute.map((userExe) => (
              <Picker.Item
                label={userExe.name}
                value={userExe.id}
                key={userExe.id}
              />
            ))}
          </Picker>

          <View style={{ alignItems: "center" }}>
            <Button
              style={{
                width: 200,
                marginTop: 20,
                backgroundColor: "orange",
              }}
              mode="contained"
              onPress={() => sendTask(selectedExecute)}
              loading={isLoadingButton}
            >
              Guardar Tarea
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textGray: {
    color: "gray",
  },
  textRed: {
    color: "red",
  },
  ml4: {
    marginLeft: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  taskButtonContainer: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskButton: {
    backgroundColor: "#1d9bf1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  taskButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  taskBoxContainer: {
    flexDirection: "row",
    paddingTop: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    marginRight: 8,
    marginTop: 10,
    borderRadius: 21,
  },
  input: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "white",
    height: 100,
  },
});
