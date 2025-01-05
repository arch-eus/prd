import { w as writable, d as derived } from "./index.js";
import { get, set } from "idb-keyval";
import { startOfDay, parseISO } from "date-fns";
import { c as create_ssr_component, i as compute_rest_props, j as spread, k as escape_object, l as escape_attribute_value, e as each } from "./ssr.js";
const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
async function getTasks() {
  try {
    return await get("tasks") || [];
  } catch (error) {
    console.error("Error getting tasks:", error);
    return [];
  }
}
async function saveTasks(tasks) {
  try {
    await set("tasks", tasks);
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}
function normalizeDate(date) {
  if (!date) return void 0;
  if (typeof date === "string") {
    if (date.length === 10) {
      date = `${date}T12:00:00`;
    }
    return startOfDay(parseISO(date));
  }
  return startOfDay(date);
}
function normalizeTask(task) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: task.id || crypto.randomUUID(),
    title: task.title || "",
    description: task.description,
    notes: task.notes,
    status: task.status || "todo",
    labels: task.labels || [],
    dueDate: task.dueDate ? normalizeDate(task.dueDate) : void 0,
    completedAt: task.completedAt ? new Date(task.completedAt) : void 0,
    order: task.order || 0,
    createdAt: task.createdAt ? new Date(task.createdAt) : now,
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : now,
    recurrence: task.recurrence || null
  };
}
const selectedTags = writable([]);
const selectedDate = writable(null);
const initialState = {
  tasks: [],
  loading: false,
  error: null
};
function createTaskStore() {
  const { subscribe, set: set2, update } = writable(initialState);
  return {
    subscribe,
    async init() {
      update((state) => ({ ...state, loading: true }));
      try {
        const tasks = await getTasks() || [];
        set2({
          tasks: tasks.map(normalizeTask),
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Failed to initialize task store:", error);
        set2({ tasks: [], loading: false, error: "Failed to load tasks" });
      }
    },
    async addTask(task) {
      update((state) => {
        const newTask = normalizeTask({
          ...task,
          id: crypto.randomUUID(),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date(),
          order: state.tasks.length
        });
        const updatedTasks = [...state.tasks, newTask];
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    },
    async updateTask(id, updates) {
      update((state) => {
        const updatedTasks = state.tasks.map(
          (task) => task.id === id ? { ...task, ...updates, updatedAt: /* @__PURE__ */ new Date() } : task
        );
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    },
    async deleteTask(id) {
      update((state) => {
        const updatedTasks = state.tasks.filter((task) => task.id !== id);
        saveTasks(updatedTasks);
        return { ...state, tasks: updatedTasks };
      });
    }
  };
}
const taskStore = createTaskStore();
const filteredTasks = derived(
  [taskStore, selectedDate, selectedTags],
  ([$store, $date, $tags]) => {
    if (!$store.tasks?.length) return [];
    let tasks = $store.tasks;
    if ($date) {
      const startOfDay2 = new Date($date);
      startOfDay2.setHours(0, 0, 0, 0);
      if (startOfDay2 < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0))) {
        tasks = tasks.filter(
          (t) => t.status === "completed" && t.completedAt && new Date(t.completedAt).toDateString() === startOfDay2.toDateString()
        );
      } else {
        tasks = tasks.filter(
          (t) => t.status === "todo" && t.dueDate && new Date(t.dueDate).toDateString() === startOfDay2.toDateString()
        );
      }
    }
    if ($tags.length) {
      tasks = tasks.filter(
        (t) => t.labels?.some((label) => $tags.includes(label))
      );
    }
    return tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
);
const completedTasks = derived(
  taskStore,
  ($store) => ($store.tasks || []).filter((task) => task.status === "completed").sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
);
/**
 * @license lucide-svelte v0.314.0 - ISC

This source code is licensed under the ISC license.
See the LICENSE file in the root directory of this source tree.
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"]);
  let { name } = $$props;
  let { color = "currentColor" } = $$props;
  let { size = 24 } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { absoluteStrokeWidth = false } = $$props;
  let { iconNode } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0) $$bindings.strokeWidth(strokeWidth);
  if ($$props.absoluteStrokeWidth === void 0 && $$bindings.absoluteStrokeWidth && absoluteStrokeWidth !== void 0) $$bindings.absoluteStrokeWidth(absoluteStrokeWidth);
  if ($$props.iconNode === void 0 && $$bindings.iconNode && iconNode !== void 0) $$bindings.iconNode(iconNode);
  return `  <svg${spread(
    [
      escape_object(defaultAttributes),
      escape_object($$restProps),
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      { stroke: escape_attribute_value(color) },
      {
        "stroke-width": escape_attribute_value(absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth)
      },
      {
        class: escape_attribute_value(`lucide-icon lucide lucide-${name} ${$$props.class ?? ""}`)
      }
    ],
    {}
  )}>${each(iconNode, ([tag, attrs]) => {
    return `${((tag$1) => {
      return tag$1 ? `<${tag}${spread([escape_object(attrs)], {})}>${is_void(tag$1) ? "" : ``}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
    })(tag)}`;
  })}${slots.default ? slots.default({}) : ``}</svg>`;
});
export {
  Icon as I,
  selectedDate as a,
  completedTasks as c,
  filteredTasks as f,
  selectedTags as s,
  taskStore as t
};
