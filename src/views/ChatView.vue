<script setup lang="ts">
import ChatBubble from "@/components/ChatBubble.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SendHorizonal } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { nextTick, onMounted, ref, watch } from "vue";
import { useChatStore } from "@/stores/chat";
import { storeToRefs } from "pinia";

const route = useRoute();
const chatStore = useChatStore();
const { chats, newMessage, roomName, roomAvatar, roomLastSeenDate } =
  storeToRefs(chatStore);
const messagesContainer = ref<HTMLDivElement | null>(null);

const { loadMessages, sendMessage } = chatStore;

const handleSendMessage = () => {
  sendMessage();
  scrollToBottom();
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
    route.params.id = newId;
    if (newId) {
      loadMessages(newId as string);
      scrollToBottom();
    }
  },
  { immediate: true } // Run immediately on component creation
);

// Scroll when messages change
watch(
  () => chats,
  () => scrollToBottom(),
  { deep: true }
);

// Initialize the store
onMounted(async () => {
  if (route.params.id) {
    chatStore.loadMessages(route.params.id as string);
    scrollToBottom();
  }
});
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
    <form @submit.prevent="handleSendMessage" class="px-4 pb-4 flex gap-2">
      <Input
        type="text"
        placeholder="Enter your message"
        v-model="newMessage"
        :disabled="roomName == 'Unknown Room'"
      />
      <Button size="icon" class="cursor-pointer" :disabled="!newMessage">
        <SendHorizonal class="w-4" />
      </Button>
    </form>
  </div>
</template>
