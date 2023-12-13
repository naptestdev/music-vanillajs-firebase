import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { auth, subscriptions } from "./firebase.js";

const routes = {
  "/": {
    body: "./routes/home.html",
    requireAuth: false,
    notRequireAuth: false,
  },
  "/login": {
    body: "./routes/login.html",
    requireAuth: false,
    notRequireAuth: true,
  },
  "/register": {
    body: "./routes/register.html",
    requireAuth: false,
    notRequireAuth: true,
  },
  "/playlist/:id": {
    body: "./routes/review.html",
    requireAuth: false,
    notRequireAuth: false,
  },
  "/search": {
    body: "./routes/search.html",
    requireAuth: false,
    notRequireAuth: false,
  },
};

const isMatchRoute = (route, pathname) => {
  const parsed = route.replace(/\/:[^\/]+/gm, "/[^\\/]+");

  const regex = new RegExp(`^${parsed}\\/?$`, "gm");
  const isMatching = regex.test(pathname);

  let params = {};

  if (isMatching) {
    const routeMatches = route.match(/\/[^\\\/]+/gm) || [];
    const pathnameMatches = pathname.match(/\/[^\\\/]+/gm) || [];

    for (const [index, routeMatch] of routeMatches.entries()) {
      if (routeMatch.startsWith("/:")) {
        params[routeMatch.slice(2)] = pathnameMatches[index].slice(1);
      }
    }
  }

  return { isMatching, params };
};

export let params = {};

const renderRoute = async () => {
  let hasMatched = false;
  for (const route in routes) {
    const { isMatching, params: loadedParams } = isMatchRoute(
      route,
      location.hash ? location.hash.slice(1) : "/"
    );

    if (isMatching) {
      hasMatched = true;
      params = loadedParams;
      if (
        routes[route].requireAuth &&
        (!auth.currentUser || !auth.currentUser.emailVerified)
      ) {
        location.hash = "/login";
        break;
      }
      if (
        routes[route].notRequireAuth &&
        auth.currentUser &&
        auth.currentUser.emailVerified
      ) {
        location.hash = "/";
        break;
      }
      const html = await (await fetch(routes[route].body)).text();
      document.body.innerHTML = "";
      document.body.append(
        document.createRange().createContextualFragment(html)
      );
      break;
    }
  }
  if (!hasMatched) document.body.innerHTML = `404`;
  subscriptions.forEach(
    (subscription) => typeof subscription === "function" && subscription()
  );

  renderNavbarAvatarAction();
};

window.handleSignOut = () => {
  signOut(auth);
};

const renderNavbarAvatarAction = () => {
  if (document.querySelector("#avatar-action-container")) {
    if (auth.currentUser) {
      document.querySelector("#avatar-action-container").innerHTML += /*html*/ `
    <div tabindex="0" class="avatar-action">
      <img src="${`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        auth.currentUser.displayName
      )}`}" />
      <div class="popup">
        <button onclick="location.href = './?isViewingMyPlaylist=1#'" class="action-button">
          <i class="bx bx-user"></i>
          <span> My playlist</span>
        </button>
        <button class="action-button" onclick="handleSignOut()">
          <i class='bx bx-log-out' ></i>
          <span> Logout</span>
        </button>
      </div>
    </div>
  `;
    } else {
      document.querySelector("#avatar-action-container").innerHTML += /*html*/ `
    <a class="navbar-btn" href="#/register">
      <i class="bx bx-user"></i>
    </a>
  `;
    }
  }
};

onAuthStateChanged(auth, () => {
  renderRoute();
});

window.addEventListener("hashchange", () => {
  renderRoute();
});
