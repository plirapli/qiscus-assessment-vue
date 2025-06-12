import AppLayout from "@/layout/AppLayout.vue";
import ChatRoomsView from "@/views/ChatRoomsView.vue";
import ChatView from "@/views/ChatView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        { path: "/", redirect: "/chat" },
        { path: "/chat", component: ChatRoomsView },
        { path: "/chat/:id", component: ChatView },
      ],
    },
  ],
});

export default router;
