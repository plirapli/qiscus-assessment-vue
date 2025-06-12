<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { SidebarProvider } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full h-screen overflow-hidden">
      <RouterView />
    </main>
  </SidebarProvider>
</template>
