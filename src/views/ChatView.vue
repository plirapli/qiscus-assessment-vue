<script setup lang="ts">
import ChatBubble from "@/components/ChatBubble.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDateFormat } from "@vueuse/core";
import { SendHorizonal } from "lucide-vue-next";
import { useRoute } from "vue-router";
import messages from "@/data/messages.json";
import { computed, nextTick, ref, watch, type Ref } from "vue";
import roomList from "@/data/list_rooms.json";

interface Chat {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const route = useRoute();
const roomId = ref(route.params.id);
const chats: Ref<Chat[]> = ref([]);
const currentChat = ref("");
const messagesContainer = ref<HTMLDivElement | null>(null);

// Get room info
const currentRoom = computed(() =>
  roomList.data.customer_rooms.find((room) => room.room_id === roomId.value)
);
const roomName = computed(() => currentRoom.value?.name || "Unknown Room");
const roomAvatar = computed(() => currentRoom.value?.user_avatar_url);
const roomLastSeenDate = computed(() => {
  const date = currentRoom.value?.last_customer_timestamp;
  return date
    ? useDateFormat(new Date(date), "DD-MM-YY, HH:mm")
    : "Unknown last seen";
});

// Load messages function
const loadMessages = (id: string | string[]) => {
  try {
    const roomData = messages.data.find((room) => room.room_id === id);
    chats.value = roomData ? roomData.chats : [];
  } catch (error) {
    console.error("Failed to load messages:", error);
  } finally {
    scrollToBottom();
  }
};

const sendMessage = () => {
  const newChat = {
    id: roomId.value.toString(),
    text: currentChat.value,
    sender: "currentUser",
    timestamp: new Date().toISOString(),
    isCurrentUser: true,
  };
  chats.value = [...chats.value, newChat];
  currentChat.value = "";
};

// Scroll to bottom helper
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Watch for route changes
watch(
  () => route.params.id,
  (newId) => {
    (roomId.value = newId), loadMessages(newId);
  },
  { immediate: true } // Run immediately on component creation
);
</script>

<template>
  <div class="h-full flex flex-col bg-zinc-50">
    <div class="flex items-center gap-2 p-4 border-b bg-white">
      <div class="w-full flex items-center gap-2.5">
        <img :src="roomAvatar" alt="" class="w-10 h-10 border rounded-full" />
        <div>
          <div>{{ roomName }}</div>
          <div class="text-sm text-zinc-400">
            Last online {{ roomLastSeenDate }}
          </div>
        </div>
      </div>
      <SidebarTrigger />
    </div>
    <div
      class="p-4 flex-1 flex flex-col gap-2 overflow-y-scroll"
      ref="messagesContainer"
    >
      <ChatBubble v-if="chats.length" v-for="chat in chats" :chat="chat" />
      <div v-else class="text-zinc-400 text-center">No Conversations yet</div>
    </div>
    <form @submit.prevent="sendMessage" class="px-4 pb-4 flex gap-2">
      <Input
        type="text"
        placeholder="Enter your message"
        v-model="currentChat"
        :disabled="roomName == 'Unknown Room'"
      />
      <Button size="icon" class="cursor-pointer" :disabled="!currentChat">
        <SendHorizonal class="w-4" />
      </Button>
    </form>
  </div>
</template>
