import { c as create_ssr_component, v as validate_component, e as each, f as escape, d as createEventDispatcher, a as subscribe, h as set_store_value } from "../../chunks/ssr.js";
import { I as Icon, a as selectedDate, f as filteredTasks, s as selectedTags } from "../../chunks/Icon.js";
import { a as searchResults, s as searchQuery } from "../../chunks/tag.js";
import { T as TaskItem } from "../../chunks/TaskItem.js";
import { i as isToday, X, T as TaskFormModal } from "../../chunks/TaskFormModal.js";
import { format, startOfDay, startOfWeek, addDays, isSameDay } from "date-fns";
const Calendar_days = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
    ],
    ["path", { "d": "M8 14h.01" }],
    ["path", { "d": "M12 14h.01" }],
    ["path", { "d": "M16 14h.01" }],
    ["path", { "d": "M8 18h.01" }],
    ["path", { "d": "M12 18h.01" }],
    ["path", { "d": "M16 18h.01" }]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "calendar-days" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Chevron_left = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m15 18-6-6 6-6" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevron-left" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Chevron_right = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m9 18 6-6-6-6" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "chevron-right" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const TaskList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tasks = [] } = $$props;
  if ($$props.tasks === void 0 && $$bindings.tasks && tasks !== void 0) $$bindings.tasks(tasks);
  return `<div class="space-y-4">${tasks.length === 0 ? `<p class="text-center text-navy-500 py-8" data-svelte-h="svelte-rglnoy">No tasks for this day</p>` : `${each(tasks, (task) => {
    return `${validate_component(TaskItem, "TaskItem").$$render($$result, { task }, {}, {})}`;
  })}`}</div>`;
});
const CalendarHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { currentDate } = $$props;
  if ($$props.currentDate === void 0 && $$bindings.currentDate && currentDate !== void 0) $$bindings.currentDate(currentDate);
  return `<div class="flex items-center justify-between font-jetbrains-mono mb-4"><div class="flex items-center gap-2"><h2 class="text-2xl font-bold text-navy-900">${escape(format(currentDate, "MMMM yyyy"))}</h2> <button class="p-1 hover:text-navy-600 transition-colors" title="Go to today">${validate_component(Calendar_days, "CalendarDays").$$render($$result, { class: "w-5 h-5" }, {}, {})}</button></div> <div class="flex items-center gap-1"><button class="p-2 hover:bg-navy-50 rounded-full transition-colors" title="Previous week">${validate_component(Chevron_left, "ChevronLeft").$$render($$result, { class: "w-4 h-4" }, {}, {})}</button> <button class="p-2 hover:bg-navy-50 rounded-full transition-colors" title="Next week">${validate_component(Chevron_right, "ChevronRight").$$render($$result, { class: "w-4 h-4" }, {}, {})}</button></div></div>`;
});
const WeekDays = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="grid grid-cols-7 gap-1 mb-1 text-sm font-medium text-navy-400 font-jetbrains-mono">${each(["M", "T", "W", "T", "F", "S", "S"], (day) => {
    return `<div class="text-center p-2">${escape(day)}</div>`;
  })}</div>`;
});
const CalendarView = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let weekStart;
  let weekDays;
  let { selectedDate: selectedDate2 = startOfDay(/* @__PURE__ */ new Date()) } = $$props;
  function isSelected(date) {
    return isSameDay(date, selectedDate2);
  }
  if ($$props.selectedDate === void 0 && $$bindings.selectedDate && selectedDate2 !== void 0) $$bindings.selectedDate(selectedDate2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    weekStart = startOfWeek(selectedDate2, { weekStartsOn: 1 });
    weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    $$rendered = `<div class="mb-8 font-jetbrains-mono">${validate_component(CalendarHeader, "CalendarHeader").$$render(
      $$result,
      { currentDate: selectedDate2 },
      {
        currentDate: ($$value) => {
          selectedDate2 = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="mt-4 max-w-screen-sm">${validate_component(WeekDays, "WeekDays").$$render($$result, {}, {}, {})} <div class="grid grid-cols-7 gap-1">${each(weekDays, (date) => {
      return `<button class="${"w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors relative " + escape(
        isToday(date) ? "text-teal-600 font-bold ring-2 ring-teal-500" : "text-navy-800",
        true
      ) + " " + escape(isSelected(date) ? "bg-navy-600 !text-white" : "", true) + " " + escape(
        !isToday(date) && !isSelected(date) ? "hover:bg-navy-50" : "",
        true
      )}">${escape(format(date, "d"))} </button>`;
    })}</div></div></div>`;
  } while (!$$settled);
  return $$rendered;
});
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { show = false } = $$props;
  let { title } = $$props;
  createEventDispatcher();
  if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  return ` ${show ? `<div class="fixed inset-0 z-[100] flex items-center justify-center p-4"> <div class="fixed inset-0 bg-navy-900/20"></div>  <div class="relative w-full max-w-lg bg-surface rounded-lg shadow-xl"><div class="p-6"><button class="absolute right-4 top-4 text-navy-400 hover:text-navy-600 transition-colors">${validate_component(X, "X").$$render($$result, { class: "w-5 h-5" }, {}, {})}</button> <h2 class="text-xl font-bold mb-4 text-navy-900">${escape(title)}</h2> ${slots.default ? slots.default({}) : ``}</div></div></div>` : ``}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentTask;
  let displayTasks;
  let $filteredTasks, $$unsubscribe_filteredTasks;
  let $searchResults, $$unsubscribe_searchResults;
  let $searchQuery, $$unsubscribe_searchQuery;
  let $selectedTags, $$unsubscribe_selectedTags;
  let $selectedDate, $$unsubscribe_selectedDate;
  $$unsubscribe_filteredTasks = subscribe(filteredTasks, (value) => $filteredTasks = value);
  $$unsubscribe_searchResults = subscribe(searchResults, (value) => $searchResults = value);
  $$unsubscribe_searchQuery = subscribe(searchQuery, (value) => $searchQuery = value);
  $$unsubscribe_selectedTags = subscribe(selectedTags, (value) => $selectedTags = value);
  $$unsubscribe_selectedDate = subscribe(selectedDate, (value) => $selectedDate = value);
  let showEditModal = false;
  let showDetailsModal = false;
  let editingTask = null;
  set_store_value(selectedDate, $selectedDate = $selectedDate || startOfDay(/* @__PURE__ */ new Date()), $selectedDate);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    currentTask = { labels: $selectedTags };
    displayTasks = $searchQuery ? $searchResults : $filteredTasks;
    $$rendered = `<div class="max-w-5xl mx-auto space-y-6">${validate_component(CalendarView, "CalendarView").$$render(
      $$result,
      { selectedDate: $selectedDate },
      {
        selectedDate: ($$value) => {
          $selectedDate = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(TaskFormModal, "TaskFormModal").$$render(
      $$result,
      {
        show: showEditModal,
        task: currentTask,
        isEditing: !!editingTask
      },
      {},
      {}
    )} ${validate_component(Modal, "Modal").$$render(
      $$result,
      {
        show: showDetailsModal,
        title: "Task Details"
      },
      {},
      {
        default: () => {
          return `${``}`;
        }
      }
    )} ${validate_component(TaskList, "TaskList").$$render($$result, { tasks: displayTasks }, {}, {})}</div>`;
  } while (!$$settled);
  $$unsubscribe_filteredTasks();
  $$unsubscribe_searchResults();
  $$unsubscribe_searchQuery();
  $$unsubscribe_selectedTags();
  $$unsubscribe_selectedDate();
  return $$rendered;
});
export {
  Page as default
};
