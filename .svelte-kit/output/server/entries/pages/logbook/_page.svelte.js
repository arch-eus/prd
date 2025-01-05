import { c as create_ssr_component, a as subscribe, e as each, f as escape, v as validate_component, n as noop } from "../../../chunks/ssr.js";
import { d as derived } from "../../../chunks/index.js";
import { t as taskStore, c as completedTasks } from "../../../chunks/Icon.js";
import { T as Tag } from "../../../chunks/tag.js";
import { format } from "date-fns";
import { D as Download } from "../../../chunks/download.js";
const LogbookTagFilter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $allTags, $$unsubscribe_allTags;
  let { selectedTags = [] } = $$props;
  const allTags = derived(taskStore, ($store) => {
    const tags = /* @__PURE__ */ new Set();
    $store.tasks.forEach((task) => {
      task.labels?.forEach((label) => tags.add(label));
    });
    return Array.from(tags).sort();
  });
  $$unsubscribe_allTags = subscribe(allTags, (value) => $allTags = value);
  if ($$props.selectedTags === void 0 && $$bindings.selectedTags && selectedTags !== void 0) $$bindings.selectedTags(selectedTags);
  $$unsubscribe_allTags();
  return `<div class="flex flex-wrap gap-2 mb-6">${each($allTags, (tag) => {
    return `<button class="${"flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors font-jetbrains-mono " + escape(
      selectedTags.includes(tag) ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100",
      true
    )}">${validate_component(Tag, "Tag").$$render($$result, { class: "w-3 h-3" }, {}, {})} ${escape(tag)} </button>`;
  })}</div>`;
});
const LogbookTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tasks } = $$props;
  if ($$props.tasks === void 0 && $$bindings.tasks && tasks !== void 0) $$bindings.tasks(tasks);
  return `<div class="overflow-x-auto"><table class="w-full text-sm font-jetbrains-mono"><thead data-svelte-h="svelte-yslab2"><tr class="border-b border-navy-100"><th class="py-3 px-4 text-left font-medium text-navy-600">Task</th> <th class="py-3 px-4 text-left font-medium text-navy-600">Completed</th> <th class="py-3 px-4 text-left font-medium text-navy-600">Notes</th></tr></thead> <tbody>${each(tasks, (task) => {
    return `<tr class="border-b border-navy-50 hover:bg-navy-50/50"><td class="py-3 px-4"><div>${escape(task.title)}</div> ${task.recurrence ? `<div class="text-xs text-navy-500 mt-1">Recurring: ${escape(task.recurrence)} </div>` : ``}</td> <td class="py-3 px-4">${task.completedAt ? `${escape(format(task.completedAt, "MMM d, yyyy"))}` : ``}</td> <td class="py-3 px-4 whitespace-pre-line">${escape(task.notes || "")}</td> </tr>`;
  })}</tbody></table></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredTasks;
  let $filteredTasks, $$unsubscribe_filteredTasks = noop, $$subscribe_filteredTasks = () => ($$unsubscribe_filteredTasks(), $$unsubscribe_filteredTasks = subscribe(filteredTasks, ($$value) => $filteredTasks = $$value), filteredTasks);
  let selectedTags = [];
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$subscribe_filteredTasks(filteredTasks = derived(completedTasks, ($tasks) => selectedTags.length > 0 ? $tasks.filter((task) => task.labels?.some((label) => selectedTags.includes(label))) : $tasks));
    $$rendered = `<div class="space-y-6"><div class="flex justify-between items-center"><h2 class="text-2xl font-bold text-navy-900 font-jetbrains-mono" data-svelte-h="svelte-chtidl">Logbook</h2> <button class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-md transition-colors">${validate_component(Download, "Download").$$render($$result, { class: "w-4 h-4" }, {}, {})}
      Export</button></div> ${validate_component(LogbookTagFilter, "LogbookTagFilter").$$render(
      $$result,
      { selectedTags },
      {
        selectedTags: ($$value) => {
          selectedTags = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${$filteredTasks.length === 0 ? `<p class="text-navy-500 text-center py-8 font-jetbrains-mono" data-svelte-h="svelte-u3g990">No completed tasks</p>` : `${validate_component(LogbookTable, "LogbookTable").$$render($$result, { tasks: $filteredTasks }, {}, {})}`}</div>`;
  } while (!$$settled);
  $$unsubscribe_filteredTasks();
  return $$rendered;
});
export {
  Page as default
};
