import { c as create_ssr_component, v as validate_component, a as subscribe, b as add_attribute, d as createEventDispatcher, e as each, f as escape } from "../../chunks/ssr.js";
import { I as Icon, t as taskStore, s as selectedTags, a as selectedDate } from "../../chunks/Icon.js";
import { s as searchQuery, T as Tag } from "../../chunks/tag.js";
import { X, T as TaskFormModal } from "../../chunks/TaskFormModal.js";
import { d as derived } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
import { R as Rotate_ccw } from "../../chunks/rotate-ccw.js";
const Book = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "book" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Calendar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "4",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "line",
      {
        "x1": "16",
        "x2": "16",
        "y1": "2",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "8",
        "x2": "8",
        "y1": "2",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "3",
        "x2": "21",
        "y1": "10",
        "y2": "10"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "calendar" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Check_square = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "m9 11 3 3L22 4" }],
    [
      "path",
      {
        "d": "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check-square" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Menu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "6",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "20",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "menu" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Mic = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
      }
    ],
    ["path", { "d": "M19 10v2a7 7 0 0 1-14 0v-2" }],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "19",
        "y2": "22"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "mic" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "plus" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Search = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "11", "cy": "11", "r": "8" }],
    ["path", { "d": "m21 21-4.3-4.3" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "search" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const SearchBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $searchQuery, $$unsubscribe_searchQuery;
  $$unsubscribe_searchQuery = subscribe(searchQuery, (value) => $searchQuery = value);
  let { searchInput = null } = $$props;
  if ($$props.searchInput === void 0 && $$bindings.searchInput && searchInput !== void 0) $$bindings.searchInput(searchInput);
  $$unsubscribe_searchQuery();
  return `<div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">${validate_component(Search, "Search").$$render($$result, { class: "h-5 w-5 text-navy-400" }, {}, {})}</div> <input type="text" placeholder="Search tasks..." class="block w-full pl-10 pr-8 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent text-sm transition-colors"${add_attribute("this", searchInput, 0)}${add_attribute("value", $searchQuery, 0)}> ${$searchQuery ? `<button class="absolute inset-y-0 right-0 pr-3 flex items-center text-navy-400 hover:text-navy-600">${validate_component(X, "X").$$render($$result, { class: "h-4 w-4" }, {}, {})}</button>` : ``}</div>`;
});
const TopBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { searchInput = null } = $$props;
  createEventDispatcher();
  if ($$props.searchInput === void 0 && $$bindings.searchInput && searchInput !== void 0) $$bindings.searchInput(searchInput);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<header class="fixed inset-x-0 top-0 h-16 bg-surface border-b border-navy-100 z-30"><div class="h-full px-4 flex items-center justify-between gap-4"><div class="flex items-center gap-4"><button class="lg:hidden p-2 hover:bg-navy-50 rounded-md">${validate_component(Menu, "Menu").$$render($$result, { class: "w-5 h-5" }, {}, {})}</button></div> <div class="flex-1 max-w-xl">${validate_component(SearchBar, "SearchBar").$$render(
      $$result,
      { searchInput },
      {
        searchInput: ($$value) => {
          searchInput = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="flex items-center gap-2"><button class="${[
      "p-2 hover:bg-navy-50 rounded-md relative",
      ""
    ].join(" ").trim()}" title="Add task by voice">${validate_component(Mic, "Mic").$$render($$result, { class: "w-5 h-5" }, {}, {})} ${``}</button> <button class="p-2 hover:bg-navy-50 rounded-md" title="Add new task">${validate_component(Plus, "Plus").$$render($$result, { class: "w-5 h-5" }, {}, {})}</button></div></div></header>`;
  } while (!$$settled);
  return $$rendered;
});
const QuickTags = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $popularTags, $$unsubscribe_popularTags;
  let { selectedTags: selectedTags2 = [] } = $$props;
  let { vertical = false } = $$props;
  const popularTags = derived(taskStore, ($store) => {
    const tags = /* @__PURE__ */ new Set();
    $store.tasks.forEach((task) => {
      task.labels?.forEach((label) => tags.add(label));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  });
  $$unsubscribe_popularTags = subscribe(popularTags, (value) => $popularTags = value);
  if ($$props.selectedTags === void 0 && $$bindings.selectedTags && selectedTags2 !== void 0) $$bindings.selectedTags(selectedTags2);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0) $$bindings.vertical(vertical);
  $$unsubscribe_popularTags();
  return `<div${add_attribute("class", `flex gap-2 ${vertical ? "flex-col" : "flex-wrap"}`, 0)}>${each($popularTags, (tag) => {
    return `<button class="${"flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors " + escape(
      selectedTags2.includes(tag) ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100",
      true
    )}">${validate_component(Tag, "Tag").$$render($$result, { class: "w-3 h-3" }, {}, {})} ${escape(tag)} </button>`;
  })}</div>`;
});
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $selectedTags, $$unsubscribe_selectedTags;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_selectedTags = subscribe(selectedTags, (value) => $selectedTags = value);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<nav class="p-4 space-y-6 font-jetbrains-mono"><div class="space-y-2"><h3 class="px-4 text-sm font-medium text-navy-400" data-svelte-h="svelte-ytwhzg">Tasks</h3> <a href="/" class="${"flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors " + escape(
      $page.url.pathname === "/" ? "bg-navy-600 text-white" : "text-navy-800 hover:bg-navy-50",
      true
    )}">${validate_component(Calendar, "Calendar").$$render($$result, { class: "w-4 h-4" }, {}, {})}
      Overview</a> <a href="/recurring" class="${"flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors " + escape(
      $page.url.pathname === "/recurring" ? "bg-navy-600 text-white" : "text-navy-800 hover:bg-navy-50",
      true
    )}">${validate_component(Rotate_ccw, "RotateCcw").$$render($$result, { class: "w-4 h-4" }, {}, {})}
      Recurring</a> <a href="/completed" class="${"flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors " + escape(
      $page.url.pathname === "/completed" ? "bg-navy-600 text-white" : "text-navy-800 hover:bg-navy-50",
      true
    )}">${validate_component(Check_square, "CheckSquare").$$render($$result, { class: "w-4 h-4" }, {}, {})}
      Completed</a> <a href="/logbook" class="${"flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors " + escape(
      $page.url.pathname === "/logbook" ? "bg-navy-600 text-white" : "text-navy-800 hover:bg-navy-50",
      true
    )}">${validate_component(Book, "Book").$$render($$result, { class: "w-4 h-4" }, {}, {})}
      Logbook</a></div> <div class="space-y-2"><h3 class="px-4 text-sm font-medium text-navy-400" data-svelte-h="svelte-1kt67db">Tags</h3> <div class="px-4">${validate_component(QuickTags, "QuickTags").$$render(
      $$result,
      {
        vertical: true,
        selectedTags: $selectedTags
      },
      {
        selectedTags: ($$value) => {
          $selectedTags = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div></nav>`;
  } while (!$$settled);
  $$unsubscribe_page();
  $$unsubscribe_selectedTags();
  return $$rendered;
});
const KeyboardShortcuts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { show = false } = $$props;
  const shortcuts = [
    {
      key: "?",
      description: "Show keyboard shortcuts"
    },
    { key: "n", description: "Create new task" },
    { key: "/", description: "Focus search" },
    { key: "t", description: "Go to today" },
    {
      key: "Esc",
      description: "Close modal / Clear search"
    }
  ];
  if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
  return `<div class="${[
    "fixed inset-0 z-50 flex items-center justify-center p-4",
    !show ? "hidden" : ""
  ].join(" ").trim()}"><div class="absolute inset-0 bg-navy-900/20"></div> <div class="relative w-full max-w-lg bg-white rounded-lg shadow-xl"><div class="p-6"><button class="absolute right-4 top-4 text-navy-400 hover:text-navy-600">${validate_component(X, "X").$$render($$result, { class: "w-5 h-5" }, {}, {})}</button> <h2 class="text-xl font-bold mb-4" data-svelte-h="svelte-mtw78c">Keyboard Shortcuts</h2> <div class="space-y-2">${each(shortcuts, ({ key, description }) => {
    return `<div class="flex items-center justify-between"><span class="text-navy-600">${escape(description)}</span> <kbd class="px-2 py-1 bg-navy-50 rounded text-sm">${escape(key)}</kbd> </div>`;
  })}</div></div></div></div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedDate, $$unsubscribe_selectedDate;
  let $selectedTags, $$unsubscribe_selectedTags;
  $$unsubscribe_selectedDate = subscribe(selectedDate, (value) => $selectedDate = value);
  $$unsubscribe_selectedTags = subscribe(selectedTags, (value) => $selectedTags = value);
  let showTaskModal = false;
  let showHelpModal = false;
  let initialTaskTitle = "";
  let searchInput = null;
  let taskFormRef = null;
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = ` <div class="min-h-screen bg-background font-jetbrains-mono">${validate_component(TopBar, "TopBar").$$render(
      $$result,
      { searchInput },
      {
        searchInput: ($$value) => {
          searchInput = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(KeyboardShortcuts, "KeyboardShortcuts").$$render(
      $$result,
      { show: showHelpModal },
      {
        show: ($$value) => {
          showHelpModal = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(TaskFormModal, "TaskFormModal").$$render(
      $$result,
      {
        show: showTaskModal,
        task: {
          title: initialTaskTitle,
          labels: $selectedTags,
          dueDate: $selectedDate || /* @__PURE__ */ new Date()
        },
        this: taskFormRef
      },
      {
        this: ($$value) => {
          taskFormRef = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="flex pt-16"><aside class="${"fixed inset-y-0 left-0 pt-16 w-64 bg-surface border-r border-navy-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 z-20 " + escape("-translate-x-full", true)}">${validate_component(Sidebar, "Sidebar").$$render($$result, {}, {}, {})}</aside> <main class="flex-1 lg:pl-64"><div class="p-4 sm:p-6 lg:p-8">${slots.default ? slots.default({}) : ``}</div></main></div> ${``}</div>`;
  } while (!$$settled);
  $$unsubscribe_selectedDate();
  $$unsubscribe_selectedTags();
  return $$rendered;
});
export {
  Layout as default
};
