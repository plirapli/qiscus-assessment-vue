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

const chatRooms = roomList.data.customer_rooms;

const isActiveLink = (routePath: string) => {
  const route = useRoute();
  return route.params.id === routePath;
};
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Chat Rooms</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in chatRooms" :key="item.room_id">
              <SidebarMenuButton asChild>
                <RouterLink
                  :to="`/chat/${item.room_id}`"
                  :class="`p-3 h-full ${
                    isActiveLink(item.room_id)
                      ? 'bg-zinc-200 hover:bg-zinc-200!'
                      : ''
                  }`"
                >
                  <div class="flex gap-2">
                    <img
                      :src="item.user_avatar_url"
                      class="h-10 w-10 border rounded-full"
                      alt=""
                    />
                    <div>
                      <div>{{ item.name }}</div>
                      <div>Lorem ipsum dolor sit amet</div>
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
