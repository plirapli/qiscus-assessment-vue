import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import messages from "@/data/messages.json";
import roomList from "@/data/list_rooms.json";
import { useDateFormat } from "@vueuse/core";

interface Chat {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export const useChatStore = defineStore("chat", () => {
  // State
  const rooms = ref<any>([...roomList.data.customer_rooms]); // Make rooms reactive
  const currentRoomId = ref<string>("");
  const chats: Ref<Chat[] | any[]> = ref([]);
  const newMessage = ref("");

  // Getters
  const currentRoom = computed(() =>
    roomList.data.customer_rooms.find(
      (room) => room.room_id === currentRoomId.value
    )
  );
  const roomName = computed(() => currentRoom.value?.name || "Unknown Room");
  const roomAvatar = computed(() => currentRoom.value?.user_avatar_url);
  const roomLastSeenDate = computed(() => {
    const date = currentRoom.value?.last_customer_timestamp;
    return date
      ? useDateFormat(new Date(date), "DD-MM-YY, HH:mm")
      : "Unknown last seen";
  });
  const roomsWithLastChat = computed(() => {
    return rooms.value.map((room: { room_id: string }) => {
      const roomChats =
        messages.data.find((m) => m.room_id === room.room_id)?.chats || [];
      const lastMessage = roomChats[roomChats.length - 1];

      return {
        ...room,
        lastChat: lastMessage?.text,
      };
    });
  });

  // Actions
  // Load messages function
  const loadMessages = (id: string | string[]) => {
    if (currentRoomId.value === id && chats.value.length) return;
    currentRoomId.value = id.toString();

    try {
      const roomData = messages.data.find((room) => room.room_id === id);
      chats.value = roomData ? roomData.chats : [];
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.value.trim()) return;

    const newMsg: Chat = {
      id: currentRoomId.value,
      text: newMessage.value,
      sender: "currentUser",
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
    };

    chats.value.push(newMsg);

    // Update the last message in the rooms data
    const roomIndex = rooms.value.findIndex(
      (r: { room_id: string }) => r.room_id === currentRoomId.value
    );
    if (roomIndex !== -1) {
      rooms.value[roomIndex].lastMessage = newMsg.text;
    }

    newMessage.value = "";
  };

  return {
    // State
    currentRoomId,
    chats,
    newMessage,

    // Getters
    rooms: roomsWithLastChat,
    currentRoom,
    roomName,
    roomAvatar,
    roomLastSeenDate,

    // Actions
    loadMessages,
    sendMessage,
  };
});
