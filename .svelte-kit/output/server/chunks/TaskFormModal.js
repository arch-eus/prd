import { c as create_ssr_component, v as validate_component, a as subscribe, e as each, f as escape, b as add_attribute, d as createEventDispatcher } from "./ssr.js";
import { I as Icon, t as taskStore, a as selectedDate } from "./Icon.js";
import { d as derived } from "./index.js";
import { T as Tag } from "./tag.js";
import { isSameDay, startOfDay, parseISO } from "date-fns";
const X = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "x" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const TagInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $allTags, $$unsubscribe_allTags;
  let { selectedTags = [] } = $$props;
  let tagInput = "";
  const allTags = derived(taskStore, ($store) => {
    const tags = /* @__PURE__ */ new Set();
    $store.tasks.forEach((task) => {
      task.labels?.forEach((label) => tags.add(label));
    });
    return Array.from(tags).sort();
  });
  $$unsubscribe_allTags = subscribe(allTags, (value) => $allTags = value);
  if ($$props.selectedTags === void 0 && $$bindings.selectedTags && selectedTags !== void 0) $$bindings.selectedTags(selectedTags);
  $allTags.filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag));
  $$unsubscribe_allTags();
  return `\`\`\`svelte
 <div class="relative"><div class="flex flex-wrap gap-2 mb-2">${each(selectedTags, (tag) => {
    return `<span class="inline-flex items-center gap-1 px-2 py-1 bg-navy-50 text-navy-700 text-sm rounded group">${validate_component(Tag, "Tag").$$render($$result, { class: "w-3 h-3" }, {}, {})} ${escape(tag)} <button type="button" class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">${validate_component(X, "X").$$render($$result, { class: "w-3 h-3" }, {}, {})}</button> </span>`;
  })}</div> <div class="relative"><input type="text" placeholder="Add tag" class="w-full px-0 text-navy-700 bg-transparent border-0 border-b-2 border-navy-100 focus:ring-0 focus:border-navy-600 placeholder-navy-300"${add_attribute("value", tagInput, 0)}> ${``}</div></div>
\`\`\``;
});
const TaskFormField = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id } = $$props;
  let { label = "" } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0) $$bindings.label(label);
  return `<div class="relative">${label ? `<label${add_attribute("for", id, 0)} class="block text-sm font-medium text-navy-700 mb-1">${escape(label)}</label>` : ``} ${slots.default ? slots.default({}) : ``}</div>`;
});
function isToday(date) {
  return isSameDay(date, /* @__PURE__ */ new Date());
}
function normalizeDate(date) {
  if (!date) return void 0;
  startOfDay(/* @__PURE__ */ new Date());
  if (typeof date === "string") {
    if (date.length === 10) {
      date = `${date}T12:00:00`;
    }
    return startOfDay(parseISO(date));
  }
  return startOfDay(date);
}
function dateToInputValue(date) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const TaskForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { task = {} } = $$props;
  let { isEditing = false } = $$props;
  let { selectedDate: selectedDate2 = /* @__PURE__ */ new Date() } = $$props;
  let { submitForm } = $$props;
  createEventDispatcher();
  let title = task.title || "";
  let description = task.description || "";
  let notes = task.notes || "";
  let dueDate = dateToInputValue(task.dueDate ? normalizeDate(task.dueDate) : selectedDate2);
  let selectedTags = task.labels || [];
  task.recurrence || null;
  let titleInput;
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.isEditing === void 0 && $$bindings.isEditing && isEditing !== void 0) $$bindings.isEditing(isEditing);
  if ($$props.selectedDate === void 0 && $$bindings.selectedDate && selectedDate2 !== void 0) $$bindings.selectedDate(selectedDate2);
  if ($$props.submitForm === void 0 && $$bindings.submitForm && submitForm !== void 0) $$bindings.submitForm(submitForm);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<form class="space-y-4">${validate_component(TaskFormField, "TaskFormField").$$render($$result, { id: "title" }, {}, {
      default: () => {
        return `<input type="text" id="title" class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors" placeholder="What needs to be done?" required${add_attribute("this", titleInput, 0)}${add_attribute("value", title, 0)}>`;
      }
    })} ${validate_component(TaskFormField, "TaskFormField").$$render($$result, { id: "description" }, {}, {
      default: () => {
        return `<textarea id="description" class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors" rows="2" placeholder="Add description (optional)">${escape(description || "")}</textarea>`;
      }
    })} <div class="grid grid-cols-2 gap-4">${validate_component(TaskFormField, "TaskFormField").$$render($$result, { id: "dueDate" }, {}, {
      default: () => {
        return `<input type="date" id="dueDate" class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors" required${add_attribute("value", dueDate, 0)}>`;
      }
    })} ${validate_component(TaskFormField, "TaskFormField").$$render($$result, { id: "recurrence" }, {}, {
      default: () => {
        return `<select id="recurrence" class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors appearance-none"><option${add_attribute("value", null, 0)} data-svelte-h="svelte-1rig6zw">No recurrence</option><option value="monthly" data-svelte-h="svelte-tw57k4">Monthly</option><option value="quarterly" data-svelte-h="svelte-oqfe2w">Quarterly</option><option value="yearly" data-svelte-h="svelte-1d4gmsu">Yearly</option></select>`;
      }
    })}</div> ${validate_component(TaskFormField, "TaskFormField").$$render($$result, { id: "notes" }, {}, {
      default: () => {
        return `<textarea id="notes" class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-teal-500 bg-transparent transition-colors" rows="2" placeholder="Add notes (optional)">${escape(notes || "")}</textarea>`;
      }
    })} ${validate_component(TaskFormField, "TaskFormField").$$render($$result, { id: "tags" }, {}, {
      default: () => {
        return `${validate_component(TagInput, "TagInput").$$render(
          $$result,
          { selectedTags },
          {
            selectedTags: ($$value) => {
              selectedTags = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      }
    })} <div class="flex justify-end gap-2"><button type="submit" class="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700 transition-colors">${escape(isEditing ? "Update" : "Create")} Task</button></div></form>`;
  } while (!$$settled);
  return $$rendered;
});
const TaskFormModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedDate, $$unsubscribe_selectedDate;
  $$unsubscribe_selectedDate = subscribe(selectedDate, (value) => $selectedDate = value);
  let { show = false } = $$props;
  let { task = {} } = $$props;
  let { isEditing = false } = $$props;
  let { initialTags = [] } = $$props;
  let formRef = null;
  createEventDispatcher();
  function submitForm() {
    formRef?.handleSubmit();
  }
  if ($$props.show === void 0 && $$bindings.show && show !== void 0) $$bindings.show(show);
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.isEditing === void 0 && $$bindings.isEditing && isEditing !== void 0) $$bindings.isEditing(isEditing);
  if ($$props.initialTags === void 0 && $$bindings.initialTags && initialTags !== void 0) $$bindings.initialTags(initialTags);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${show ? `<div class="fixed inset-0 z-50 flex items-center justify-center p-4"><div class="absolute inset-0 bg-navy-900/20"></div> <div class="relative w-full max-w-lg bg-surface rounded-lg shadow-xl"><div class="p-6"><button class="absolute right-4 top-4 text-navy-400 hover:text-navy-600">${validate_component(X, "X").$$render($$result, { class: "w-5 h-5" }, {}, {})}</button> <h2 class="text-xl font-bold mb-4 text-navy-900">${escape(isEditing ? "Edit Task" : "New Task")}</h2> ${validate_component(TaskForm, "TaskForm").$$render(
      $$result,
      {
        task,
        isEditing,
        selectedTags: task.labels || initialTags,
        selectedDate: $selectedDate,
        submitForm,
        this: formRef
      },
      {
        this: ($$value) => {
          formRef = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div></div>` : ``}`;
  } while (!$$settled);
  $$unsubscribe_selectedDate();
  return $$rendered;
});
export {
  TaskFormModal as T,
  X,
  isToday as i
};
