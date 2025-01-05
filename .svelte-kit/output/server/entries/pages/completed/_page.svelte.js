import { c as create_ssr_component, e as each, f as escape, v as validate_component, a as subscribe } from "../../../chunks/ssr.js";
import { c as completedTasks } from "../../../chunks/Icon.js";
import "../../../chunks/tag.js";
import { format } from "date-fns";
import { T as TaskItem } from "../../../chunks/TaskItem.js";
const CompletedTaskList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let groupedTasks;
  let { tasks } = $$props;
  if ($$props.tasks === void 0 && $$bindings.tasks && tasks !== void 0) $$bindings.tasks(tasks);
  groupedTasks = tasks.reduce(
    (groups, task) => {
      const date = format(task.completedAt, "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    },
    {}
  );
  return `<div class="space-y-8">${each(Object.entries(groupedTasks), ([date, dateTasks]) => {
    return `<div class="space-y-2"><h3 class="text-sm font-medium text-navy-500 font-jetbrains-mono">${escape(format(new Date(date), "MMMM d, yyyy"))}</h3> <div class="space-y-2">${each(dateTasks, (task) => {
      return `${validate_component(TaskItem, "TaskItem").$$render($$result, { task }, {}, {})}`;
    })}</div> </div>`;
  })}</div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $completedTasks, $$unsubscribe_completedTasks;
  $$unsubscribe_completedTasks = subscribe(completedTasks, (value) => $completedTasks = value);
  $$unsubscribe_completedTasks();
  return `<div class="space-y-6"><h2 class="text-2xl font-bold text-navy-900 font-jetbrains-mono" data-svelte-h="svelte-87btjh">Completed Tasks</h2> ${$completedTasks.length === 0 ? `<p class="text-navy-500 text-center py-8 font-jetbrains-mono" data-svelte-h="svelte-u3g990">No completed tasks</p>` : `${validate_component(CompletedTaskList, "CompletedTaskList").$$render($$result, { tasks: $completedTasks }, {}, {})}`}</div>`;
});
export {
  Page as default
};
