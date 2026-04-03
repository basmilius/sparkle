import { createRouter, createWebHashHistory } from 'vue-router';
import PlaygroundView from './views/PlaygroundView.vue';
import SimulatorView from './views/SimulatorView.vue';

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/fireworks'
        },
        {
            path: '/playground',
            component: PlaygroundView
        },
        {
            path: '/:id',
            component: SimulatorView,
            props: true
        }
    ]
});
