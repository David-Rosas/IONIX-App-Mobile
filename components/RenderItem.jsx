import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";

import { EvilIcons } from "@expo/vector-icons";

import { formatDistanceToNowStrict, format } from "date-fns";
import locale from "date-fns/locale/en-US";
import formatDistance from "../helpers/formatDistanceCustom";
import { useNavigation } from "@react-navigation/core";
import { Chip } from "react-native-paper";

export default function RenderItem({ item: task }) {
  const navigation = useNavigation();
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
          <Text numberOfLines={4} style={styles.taskContent}>{task.description}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => gotoSingleTask(task.id)}>
          <Text style={{ marginTop: 10 }}>
            {statusStyle ? (
              <Chip style={statusStyle} selectedColor="white">
                {task.latest_status}
              </Chip>
            ) : null}
          </Text>
        </TouchableOpacity>
      </View>
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
});
