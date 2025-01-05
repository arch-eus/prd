import { c as create_ssr_component, e as each, f as escape, a as subscribe, v as validate_component } from "../../../chunks/ssr.js";
import { d as derived } from "../../../chunks/index.js";
import { t as taskStore } from "../../../chunks/Icon.js";
import { format } from "date-fns";
import { D as Download } from "../../../chunks/download.js";
const RecurringTaskTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tasks = [] } = $$props;
  if ($$props.tasks === void 0 && $$bindings.tasks && tasks !== void 0) $$bindings.tasks(tasks);
  return `<div class="overflow-x-auto"><table class="w-full text-sm font-jetbrains-mono"><thead data-svelte-h="svelte-l78nuy"><tr class="border-b border-navy-100"><th class="py-3 px-4 text-left font-medium text-navy-600">Task</th> <th class="py-3 px-4 text-left font-medium text-navy-600">Due Date</th> <th class="py-3 px-4 text-left font-medium text-navy-600">Recurrence</th> <th class="py-3 px-4 text-left font-medium text-navy-600">Tags</th></tr></thead> <tbody>${each(tasks, (task) => {
    return `<tr class="border-b border-navy-50 hover:bg-navy-50/50"><td class="py-3 px-4"><div>${escape(task.title)}</div> ${task.description ? `<div class="text-xs text-navy-500 mt-1">${escape(task.description)}</div>` : ``}</td> <td class="py-3 px-4">${escape(task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "")}</td> <td class="py-3 px-4">${escape(task.recurrence)}</td> <td class="py-3 px-4">${escape(task.labels?.join(", ") || "")}</td> </tr>`;
  })}</tbody></table></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $recurringTasks, $$unsubscribe_recurringTasks;
  const recurringTasks = derived(taskStore, ($store) => ($store.tasks || []).filter((task) => task.status === "todo" && task.recurrence).sort((a, b) => {
    const recurrenceOrder = { monthly: 1, quarterly: 2, yearly: 3 };
    const aOrder = a.recurrence ? recurrenceOrder[a.recurrence] || 0 : 0;
    const bOrder = b.recurrence ? recurrenceOrder[b.recurrence] || 0 : 0;
    return aOrder - bOrder;
  }));
  $$unsubscribe_recurringTasks = subscribe(recurringTasks, (value) => $recurringTasks = value);
  $$unsubscribe_recurringTasks();
  return `<div class="space-y-6"><div class="flex justify-between items-center"><h2 class="text-2xl font-bold text-navy-900 font-jetbrains-mono" data-svelte-h="svelte-qe6gcz">Recurring Tasks</h2> <button class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-md transition-colors">${validate_component(Download, "Download").$$render($$result, { class: "w-4 h-4" }, {}, {})}
      Export</button></div> ${$recurringTasks.length === 0 ? `<p class="text-navy-500 text-center py-8 font-jetbrains-mono" data-svelte-h="svelte-pimsxi">No recurring tasks found</p>` : `${validate_component(RecurringTaskTable, "RecurringTaskTable").$$render($$result, { tasks: $recurringTasks }, {}, {})}`}</div>`;
});
export {
  Page as default
};
