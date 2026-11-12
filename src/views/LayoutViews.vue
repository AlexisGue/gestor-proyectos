<template>
  <div class="flex min-h-screen flex-col">
    <TopMenu />
    <main class="flex flex-1 flex-row">
      <SideMenu />
      <section class="flex-1 p-6">
        <RouterView />
      </section>
    </main>
    <FooterMenu />
  </div>
</template>


<script setup lang="ts">
import SideMenu from '../components/SideMenu.vue'
import TopMenu from '../components/TopMenu.vue'
import FooterMenu from '../components/FooterMenu.vue'
</script>
