<script setup lang="ts">
import roomList from "@/data/list_rooms.json";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RouterLink, useRoute } from "vue-router";
import { useChatStore } from "@/stores/chat";
import { computed } from "vue";
import { storeToRefs } from "pinia";

const isActiveLink = (routePath: string) => {
  const route = useRoute();
  return route.params.id === routePath;
};

const chatStore = useChatStore();
// Use the computed getter from the store
const { rooms: chatRooms } = storeToRefs(chatStore);
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Chat Rooms</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="room in chatRooms" :key="room.room_id">
              <SidebarMenuButton asChild>
                <RouterLink
                  :to="`/chat/${room.room_id}`"
                  :class="`p-3 h-full ${
                    isActiveLink(room.room_id)
                      ? 'bg-zinc-200 hover:bg-zinc-200!'
                      : ''
                  }`"
                >
                  <div class="flex gap-2">
                    <img
                      :src="room.user_avatar_url"
                      class="h-10 w-10 border rounded-full"
                      alt=""
                    />
                    <div>
                      <div>{{ room.name }}</div>
                      <div
                        :class="`line-clamp-1 text-zinc-500 ${
                          !room.lastChat && 'italic'
                        }`"
                      >
                        {{ room.lastChat || "No conversations yet." }}
                      </div>
                    </div>
                  </div>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
