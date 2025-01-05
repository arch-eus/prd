import { d as derived, w as writable } from "./index.js";
import { t as taskStore, I as Icon } from "./Icon.js";
import { c as create_ssr_component, v as validate_component } from "./ssr.js";
const searchQuery = writable("");
const searchResults = derived(
  [taskStore, searchQuery],
  ([$store, $query]) => {
    const query = $query.trim();
    if (!query) return [];
    const searchTerms = query.toLowerCase().split(" ");
    return $store.tasks.filter((task) => task.status === "todo").filter((task) => {
      const searchableText = [
        task.title,
        task.description || "",
        task.notes || "",
        ...task.labels || []
      ].filter(Boolean).join(" ").toLowerCase();
      return searchTerms.every((term) => searchableText.includes(term));
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  }
);
const Tag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"
      }
    ],
    ["path", { "d": "M7 7h.01" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "tag" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
export {
  Tag as T,
  searchResults as a,
  searchQuery as s
};
