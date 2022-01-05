import { createStore } from "vuex";
import log_in from "./modules/log_in";
import user from "./modules/user";
import pop_up from "./modules/pop_up";
import genres from "./modules/genres";
import artists from "./modules/artists";
import groups from "./modules/groups";
import albums from "./modules/albums";
import tracks from "./modules/tracks";
import search from "./modules/search";
import uploading from "./modules/uploading";

export default createStore({
  modules: {
    log_in,
    uploading,
    user,
    pop_up,
    genres,
    artists,
    groups,
    albums,
    tracks,
    search,
  },
});
