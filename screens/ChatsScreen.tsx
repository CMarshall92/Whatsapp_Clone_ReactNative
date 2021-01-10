import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { View } from '../components/Themed';
import ChatListItem from '../components/ChatListItem';
import NewMessageButton from '../components/NewMessageButton';

import { Auth, API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../graphqlCustom/queries';

export default function ChatsScreen() {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();

        const userData = await API.graphql(
          graphqlOperation(
            getUser,
            { id: currentUser.attributes.sub }
          )
        );

        setChatRooms(userData.data.getUser.chatRoomUser.items);
      } catch(err) {
        console.log(err);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: '100%', backgroundColor: 'white' }}
        data={chatRooms}
        renderItem={({ item }) => <ChatListItem chatRoom={item.chatRoom} />}
        keyExtractor={(item) => item.id}
      />
      <NewMessageButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
});
