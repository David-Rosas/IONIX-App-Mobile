import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";

import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import axiosConfig from "../helpers/axiosConfig";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";
import formatDistance from "../helpers/formatDistanceCustom";

import RenderItem from "../components/RenderItem";
import { AuthContext } from "../context/AuthProvider";

export default function HomeScreen({ route, navigation }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false);
  const flatListRef = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getAllTasks();
  }, [page]);

  useEffect(() => {
    if (route.params?.newTaskAdded || route.params?.taskDeleted) {
      getAllTasksRefresh();
      flatListRef.current.scrollToOffset({
        offset: 0,
      });
    }
  }, [route.params?.newTaskAdded, route.params?.taskDeleted]);

  function getAllTasksRefresh() {
    setPage(1);
    setIsAtEndOfScrolling(false);
    setIsRefreshing(false);

    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${user.token}`;

    axiosConfig
      .get(`/tasks`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  function getAllTasks() {
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${user.token}`;

    axiosConfig
      .get(`/tasks?page=${page}`)
      .then((response) => {
        if (page === 1) {
          setData(response.data);
        } else {
          setData([...data, ...response.data]);
        }

        if (!response.data.next_page_url) {
          setIsAtEndOfScrolling(true);
        }

        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  function handleRefresh() {
    setPage(1);
    setIsAtEndOfScrolling(false);
    setIsRefreshing(true);
    getAllTasks();
  }

  function handleEnd() {
    setPage(1);
  }

  function gotoNewTask() {
    navigation.navigate("New Task");
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : data.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={({ item }) => <RenderItem item={item} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={styles.taskSeparator}></View>
          )}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleEnd}
          onEndReachedThreshold={0}
          ListFooterComponent={() =>
            !isAtEndOfScrolling && (
              <ActivityIndicator size="large" color="gray" />
            )
          }
        />
      ) : (
        <Text style={{fontWeight: 'bold', fontSize: 20, margin:20}}>No tienes tareas asignadas, ve y sé feliz</Text>
      )}
      {user.rol.machine_name == "admin" && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => gotoNewTask()}
        >
          <AntDesign name="plus" size={26} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  taskSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
    position: "absolute",
    bottom: 20,
    right: 12,
  },
});
