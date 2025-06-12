<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import { defineProps } from "vue";

defineProps({
  chat: Object,
});

const formatDate = (date: string) =>
  useDateFormat(new Date(date), "DD-MM-YY, HH:mm");
</script>

<template>
  <div
    :class="`${chat!.isCurrentUser ? 'justify-end' : ''} flex items-end gap-2`"
  >
    <div class="max-w-3/4">
      <div
        :class="`${
          chat!.isCurrentUser ? 'bg-white text-zinc-800 border' : 'bg-zinc-800 text-white'
        } max-w-fit px-3 py-2 rounded-md`"
      >
        {{ chat!.text }}
        <div class="text-sm mt-1 opacity-60 text-end">
          {{ formatDate(chat!.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>
