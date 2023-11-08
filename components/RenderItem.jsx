import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  Pressable,
} from "react-native";

import { format } from "date-fns";
import { useNavigation } from "@react-navigation/core";
import { Chip, IconButton, MD3Colors } from "react-native-paper";
import axiosConfig from "../helpers/axiosConfig";
import {} from "react-native-paper";
import { AuthContext } from "../context/AuthProvider";

export default function RenderItem({ item: task, getAllTasksRefresh }) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  let currentDate = new Date();
  currentDate = format(currentDate, "yyyy-MM-dd");

  function gotoSingleTask(taskId) {
    navigation.navigate("Task Screen", {
      taskId: taskId,
    });
  }

  const statusStyle = {
    asignado: styles.colorAsignado,
    iniciado: styles.colorIniciado,
    "finalizado-exito": styles.colorFinalizadoExito,
    "finalizado-error": styles.colorFinalizadoError,
    "en-espera": styles.colorEspera,
  }[task.status_machine_name];

  const deleteTask = (id) => {
    console.log(id)
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${user.token}`;

    axiosConfig
      .delete(`/tasks/${id}`)
      .then((response) => {
        Alert.alert("La tarea fue borrada");
        navigation.navigate("Home1", {
          taskDeleted: true,
        });
        setModalVisible(!modalVisible)
        getAllTasksRefresh()
      })
      .catch((error) => {
        Alert.alert(error);
        console.log(error.response);
      });
  };

  const showAlert = (id) => {
    if(id){
    setModalVisible(true);
    }
  };

  return (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => gotoSingleTask(task.id)}>
        <Image style={styles.avatar} source={require("../assets/task.png")} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.flexRow}
          onPress={() => gotoSingleTask(task.id)}
        >
          <Text numberOfLines={1} style={styles.taskName}>
            {task.title}
          </Text>
          <Text>&middot;</Text>
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
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.taskContentContainer}
          onPress={() => gotoSingleTask(task.id)}
        >
          <Text numberOfLines={4} style={styles.taskContent}>
            {task.description}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => gotoSingleTask(task.id)}>
            <Text style={{ marginTop: 10 }}>
              {statusStyle ? (
                <Chip compact={false} style={statusStyle} selectedColor="white">
                  <Text >{task.latest_status}</Text>
                </Chip>
              ) : null}
            </Text>
          </TouchableOpacity>
          {user.rol.machine_name == "admin" && ( <IconButton
            icon="trash-can"
            iconColor={MD3Colors.error50}
            size={25}
            onPress={() => showAlert(task.id)}
          />)}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Estas seguro de borrar esta tarea!
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                height: 43,
              }}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cerrar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonDelete]}
                onPress={() => deleteTask(task.id)}
              >
                <Text style={styles.textStyle}>Borrar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  taskContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    marginRight: 8,
    borderRadius: 21,
  },
  taskName: {
    fontWeight: "bold",
    color: "#222222",
  },
  taskHandle: {
    marginHorizontal: 8,
    color: "gray",
  },
  taskContentContainer: {
    marginTop: 4,
  },
  taskContent: {
    lineHeight: 20,
  },
  textGray: {
    color: "gray",
  },
  taskEngagement: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  ml4: {
    marginLeft: 16,
  },
  expirationDate: {
    color: "red",
  },
  notExpirationDate: {
    color: "green",
  },
  colorAsignado: {
    backgroundColor: "#0c68fa",
  },
  colorFinalizadoError: {
    backgroundColor: "#d41c0f",
  },
  colorFinalizadoExito: {
    backgroundColor: "#cfbe29",
  },
  colorEspera: {
    backgroundColor: "gray",
  },
  colorIniciado: {
    backgroundColor: "#198012",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 15,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "#db4527",
    marginRight: 10,
  },
  buttonDelete: {
    backgroundColor: "orange",
    marginLeft: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
