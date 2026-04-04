<script
    setup
    lang="ts">
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { SIMULATOR_MAP } from './config/registry';
    import { CATEGORIES } from './config/categories';

    const route = useRoute();
    const navOpen = ref(true);
</script>

<template>
    <div class="app">
        <button
            class="nav-toggle"
            type="button"
            aria-label="Toggle menu"
            @click="navOpen = !navOpen"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round">
                <line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"/>
                <line
                    x1="3"
                    y1="12"
                    x2="21"
                    y2="12"/>
                <line
                    x1="3"
                    y1="18"
                    x2="21"
                    y2="18"/>
            </svg>
        </button>

        <nav
            class="nav"
            :class="{ 'is-hidden': !navOpen }">
            <template
                v-for="category in CATEGORIES"
                :key="category.label">
                <div class="nav-section-label">{{ category.label }}</div>
                <router-link
                    v-for="id in category.ids"
                    :key="id"
                    class="nav-item"
                    :class="{ 'is-active': route.params.id === id }"
                    :to="`/${id}`"
                >{{ SIMULATOR_MAP.get(id)?.name ?? id }}
                </router-link>
            </template>

            <div class="nav-sep"/>
            <div class="nav-section-label">Combine</div>
            <router-link
                class="nav-item"
                :class="{ 'is-active': route.path === '/playground' }"
                to="/playground"
            >Playground
            </router-link>
        </nav>

        <main class="app-main">
            <router-view :key="route.path"/>
        </main>
    </div>
</template>
