console.log("IT'S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: "/", title: "Home" },
  { url: "/projects/", title: "Projects" },
  { url: "/contact/", title: "Contact" },
  { url: "/resume/", title: "Resume" },
  { url: "https://github.com/ChengszuPeng", title: "GitHub" }
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  if (
    a.host === location.host &&
    (
      a.pathname === location.pathname ||
      (a.pathname === "/" && location.pathname === "/index.html") ||
      (a.pathname.endsWith("/") && location.pathname === a.pathname + "index.html")
    )
  ) {
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

document.body.insertAdjacentHTML(
  "afterbegin",
  `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  `
);

// get select element
let select = document.querySelector(".color-scheme select");

// when user changes theme
select.addEventListener("input", function (event) {
  let value = event.target.value;

  // apply theme
  document.documentElement.style.setProperty("color-scheme", value);

  // save preference
  localStorage.colorScheme = value;
});

// when page loads → restore saved preference
if ("colorScheme" in localStorage) {
  let saved = localStorage.colorScheme;

  document.documentElement.style.setProperty("color-scheme", saved);
  select.value = saved;
}