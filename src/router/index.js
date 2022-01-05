import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Tracks",
    meta: {
      title: "AudioApp | Tracks",
    },
    component: function () {
      return import("../views/user_pages/TracksPage.vue");
    },
  },
  {
    path: "/tracks/:id",
    name: "TrackPage",
    meta: {
      title: "AudioApp | TrackPage",
    },
    component: function () {
      return import("../views/details_pages/TrackPage.vue");
    },
  },
  {
    path: "/artists",
    name: "Artists",
    meta: {
      title: "AudioApp | Artists",
    },
    component: function () {
      return import("../views/user_pages/ArtistsPage.vue");
    },
  },
  {
    path: "/artists/:id",
    name: "ArtistPage",
    meta: {
      title: "AudioApp | ArtistPage",
    },
    component: function () {
      return import("../views/details_pages/ArtistPage.vue");
    },
  },
  {
    path: "/groups",
    name: "Groups",
    meta: {
      title: "AudioApp | Groups",
    },
    component: function () {
      return import("../views/user_pages/GroupsPage.vue");
    },
  },
  {
    path: "/groups/:id",
    name: "GroupPage",
    meta: {
      title: "AudioApp | GroupPage",
    },
    component: function () {
      return import("../views/details_pages/GroupPage.vue");
    },
  },
  {
    path: "/albums",
    name: "Albums",
    meta: {
      title: "AudioApp | Albums",
    },
    component: function () {
      return import("../views/user_pages/AlbumsPage.vue");
    },
  },
  {
    path: "/albums/:id",
    name: "AlbumPage",
    meta: {
      title: "AudioApp | AlbumPage",
    },
    component: function () {
      return import("../views/details_pages/AlbumPage.vue");
    },
  },
  {
    path: "/search",
    name: "Search",
    meta: {
      title: "AudioAppKharenko | Search",
    },
    component: function () {
      return import("../views/Search.vue");
    },
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "Login",
    },
    component: function () {
      return import("../views/LogIn.vue");
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    meta: {
      title: "SignUp",
    },
    component: function () {
      return import("../views/SignUp.vue");
    },
  },
  {
    path: "/admin",
    name: "Admin",
    meta: {
      title: "Admin Control Panel",
    },
    component: function () {
      return import("../views/Admin.vue");
    },
  },
  {
    path: "/control",
    name: "ControlPanel",
    meta: {
      title: "Control Panel",
    },
    children: [
      {
        path: "",
        name: "TracksControl",
        component: function () {
          return import("../views/controls/TracksControl.vue");
        },
      },
      {
        path: "genres",
        name: "GenresControl",
        component: function () {
          return import("../views/controls/GenresControl.vue");
        },
      },
      {
        path: "artists",
        name: "ArtistsControl",
        component: function () {
          return import("../views/controls/ArtistsControl.vue");
        },
      },
      {
        path: "groups",
        name: "GroupsControl",
        component: function () {
          return import("../views/controls/GroupsControl.vue");
        },
      },
      {
        path: "albums",
        name: "AlbumsControl",
        component: function () {
          return import("../views/controls/AlbumsControl.vue");
        },
      },
    ],
    component: function () {
      return import("../views/ControlPanel.vue");
    },
  },
  {
    path: "/404",
    name: "404",
    meta: {
      title: "Not Found",
    },
    component: function () {
      return import("../views/404.vue");
    },
  },
  {
    path: "/505",
    name: "505",
    meta: {
      title: "Server Internal Error",
    },
    component: function () {
      return import("../views/505.vue");
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
    meta: {
      title: "AudioApp | 404",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((toRoute, fromRoute, next) => {
  window.document.title =
    toRoute.meta && toRoute.meta.title ? toRoute.meta.title : "AudioApp | Home";

  next();
});

export default router;
