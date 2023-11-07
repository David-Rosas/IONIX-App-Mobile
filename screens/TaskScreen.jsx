import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TextInput, Button } from "react-native-paper";

import { EvilIcons, AntDesign, Entypo } from "@expo/vector-icons";
import axiosConfig from "../helpers/axiosConfig";
import { format } from "date-fns";
import { Modalize } from "react-native-modalize";
import { AuthContext } from "../context/AuthProvider";
import { Picker } from "@react-native-picker/picker";

export default function TaskScreen({ route, navigation }) {
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const modalizeRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [selectedStatus, setSelectedStatus] = useState();
  const [comment, setComment] = useState();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  let currentDate = new Date();

  currentDate = format(currentDate, "yyyy-MM-dd");

  useEffect(() => {
    getTask();
    getStatus();
  }, []);

  useEffect(() => {}, [status]);

  const getTask = () => {
    axiosConfig
      .get(`/tasks/${route.params.taskId}`)
      .then((response) => {
        setTask(response.data);
      })
      .catch((error) => {
        Alert.alert(error);
        console.log(error);
      });
  };

  const getStatus = () => {
    axiosConfig
      .get(`/status`)
      .then((response) => {
        setStatus(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const updateTask = (status_id, comment=null) => {
    setIsLoadingButton(true)
    axiosConfig
      .put(`/tasks/${task.id}`, { status_id, comment })
      .then((response) => {
        getTask();
        getStatus();
        Alert.alert(response.data.msg);
        setIsLoadingButton(false)
      })
      .catch((error) => {
        Alert.alert(error);
        console.log(error);
        setIsLoading(false);
        setIsLoadingButton(false)
      });
  };
  const deleteTask = () => {
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${user.token}`;

    axiosConfig
      .delete(`/tasks/${route.params.taskId}`)
      .then((response) => {
        Alert.alert("Task was deleted.");
        navigation.navigate("Home1", {
          taskDeleted: true,
        });
      })
      .catch((error) => {
        Alert.alert(error);
        console.log(error.response);
      });
  };

  const showAlert = () => {
    Alert.alert("Delete this task?", null, [
      {
        text: "Cancel",
        onPress: () => modalizeRef.current?.close(),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => deleteTask(),
        style: "default",
      },
    ]);
  };

  const gotoProfile = (userId) => {
    navigation.navigate("Profile Screen", {
      userId: userId,
    });
  };

  const newStatus = () => {
    let statusTemp = [];
    status.forEach((element, index) => {
      statusTemp.push({
        name: element.name,
        id: element.id,
        isDisable: task.status_id < element.id ? false : true,
        selected: task.status_id == element.id ? true : false,
      });
    
    });
    if (task.status_id == 5) {
      statusTemp[0].isDisable = true;
      statusTemp[1].isDisable = true;
      statusTemp[2].isDisable = false;
      statusTemp[3].isDisable = false;
      statusTemp[4].isDisable = false;
    }
    if (task.status_id == 4 || task.status_id == 3) {
      statusTemp[0].isDisable = true;
      statusTemp[1].isDisable = true;
      statusTemp[2].isDisable = true;
      statusTemp[3].isDisable = true;
      statusTemp[4].isDisable = true;
    }

  

    return statusTemp;
  };

  
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        task &&
        status.length > 0 && (
          <>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                style={styles.flexRow}
              >
                <Image
                  style={styles.avatar}
                  source={require("../assets/task.png")}
                />
                <View>
                  <Text style={styles.taskName}>{task.title}</Text>
                  {task.expiration_date >= currentDate ? (
                    <Text
                      numberOfLines={2}
                      style={[styles.taskHandle, styles.notExpirationDate]}
                    >
                      Vence {task.expiration_date}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={2}
                      style={[styles.taskHandle, styles.expirationDate]}
                    >
                      Vencido el {task.expiration_date}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.taskContentContainer}>
              <Text style={styles.taskContent}>{task.description}</Text>
            </View>
            {console.log(newStatus())}
            {task.expiration_date >= currentDate ? (
              <View>
                <Text style={{ marginTop: 20, marginLeft: 15 }}>
                  Cambiar estado de la tarea
                </Text>
                <Picker
                  selectedValue={selectedStatus}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedStatus(itemValue);
                    updateTask(itemValue);
                  }}
                >
                  {newStatus().map((status) => (
                    <Picker.Item style={status.selected && styles.active}
                      label={status.name}
                      value={status.id}
                      key={status.id}
                      enabled={!status.isDisable}
                      
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text 
                style={{ marginTop: 30, paddingBottom:10, marginLeft:10, marginRight:10  }} >
                  Su tarea esta vencida solo puede dejar un comentario</Text>
                <TextInput
                  style={{ height: 200, width: "90%" }}
                  label="Comentario"
                  value={comment}
                  onChangeText={(text) => setComment(text)}
                />
                <Button
                  style={{
                    width: 200,
                    marginTop: 20,
                    textAlignVertical: "center",
                    backgroundColor: "orange",
                  }}
                  mode="contained"
                  onPress={() => updateTask(null, comment) }
                  loading={isLoadingButton}
                >
                  Guardar Comentario
                </Button>
              </View>
            )}
            <Modalize ref={modalizeRef} snapPoint={200}>
              <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
                <TouchableOpacity style={styles.menuButton}>
                  <AntDesign name="pushpino" size={24} color="#222" />
                  <Text style={styles.menuButtonText}>Pin Task</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={showAlert}
                  style={[styles.menuButton, styles.mt6]}
                >
                  <AntDesign name="delete" size={24} color="#222" />
                  <Text style={styles.menuButtonText}>Delete Task</Text>
                </TouchableOpacity>
              </View>
            </Modalize>
          </>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 8,
    borderRadius: 25,
  },
  taskName: {
    fontWeight: "bold",
    color: "#222222",
  },
  taskHandle: {
    color: "gray",
    marginTop: 4,
  },
  taskContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  taskContent: {
    fontSize: 20,
    lineHeight: 30,
  },
  taskEngagement: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  taskEngagementNumber: {
    fontWeight: "bold",
  },
  taskEngagementLabel: {
    color: "gray",
    marginLeft: 6,
  },
  taskTimestampContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  taskTimestampText: {
    color: "gray",
    marginRight: 6,
  },
  linkColor: {
    color: "#1d9bf1",
  },
  spaceAround: {
    justifyContent: "space-around",
  },
  ml4: {
    marginLeft: 16,
  },
  mt6: {
    marginTop: 32,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 20,
    color: "#222",
    marginLeft: 12,
  },
  expirationDate: {
    color: "red",
  },
  notExpirationDate: {
    color: "green",
  },
  disable: {
    backgroundColor: "#cccccc",
    color: "#cccccc",
  },

  active: {
    backgroundColor: "orange",
    color: "white",
  },
});
