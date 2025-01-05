import { c as create_ssr_component, v as validate_component, f as escape, d as createEventDispatcher, e as each } from "./ssr.js";
import { differenceInDays, differenceInWeeks, differenceInMonths, format, isBefore, startOfDay } from "date-fns";
import { R as Rotate_ccw } from "./rotate-ccw.js";
import { I as Icon } from "./Icon.js";
import { T as Tag } from "./tag.js";
const Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Trash_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M3 6h18" }],
    [
      "path",
      {
        "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
      }
    ],
    [
      "path",
      {
        "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "10",
        "y1": "11",
        "y2": "17"
      }
    ],
    [
      "line",
      {
        "x1": "14",
        "x2": "14",
        "y1": "11",
        "y2": "17"
      }
    ]
  ];
  return `  ${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "trash-2" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const TaskLeadTime = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let leadTime;
  let { dueDate } = $$props;
  if ($$props.dueDate === void 0 && $$bindings.dueDate && dueDate !== void 0) $$bindings.dueDate(dueDate);
  leadTime = (() => {
    const days = differenceInDays(
      /* @__PURE__ */ new Date(),
      dueDate
    );
    if (days < 7) return `${days}d`;
    const weeks = differenceInWeeks(
      /* @__PURE__ */ new Date(),
      dueDate
    );
    if (weeks < 4) return `${weeks}w`;
    return `${differenceInMonths(/* @__PURE__ */ new Date(), dueDate)}m`;
  })();
  return `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">+${escape(leadTime)}</span>`;
});
const RecurringInfo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { recurrence } = $$props;
  let { nextDueDate } = $$props;
  if ($$props.recurrence === void 0 && $$bindings.recurrence && recurrence !== void 0) $$bindings.recurrence(recurrence);
  if ($$props.nextDueDate === void 0 && $$bindings.nextDueDate && nextDueDate !== void 0) $$bindings.nextDueDate(nextDueDate);
  return `<span class="flex items-center gap-1 text-xs text-navy-400">${validate_component(Rotate_ccw, "RotateCcw").$$render($$result, { class: "w-3 h-3" }, {}, {})} ${escape(recurrence)} · next: ${escape(format(nextDueDate, "MMM d"))}</span>`;
});
function isTaskOverdue(task) {
  if (!task.dueDate || task.status === "completed") return false;
  return isBefore(task.dueDate, startOfDay(/* @__PURE__ */ new Date()));
}
const TaskItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isOverdue;
  let { task } = $$props;
  let { showDetails = false } = $$props;
  createEventDispatcher();
  if ($$props.task === void 0 && $$bindings.task && task !== void 0) $$bindings.task(task);
  if ($$props.showDetails === void 0 && $$bindings.showDetails && showDetails !== void 0) $$bindings.showDetails(showDetails);
  isOverdue = isTaskOverdue(task);
  return `<div class="group flex items-center gap-4 p-3 bg-surface rounded-lg shadow-soft hover:shadow-medium transition-all cursor-pointer font-jetbrains-mono"><button class="w-5 h-5 rounded-full border-2 border-navy-200 hover:border-navy-600 flex items-center justify-center transition-colors" aria-label="Complete task">${task.status === "completed" ? `${validate_component(Check, "Check").$$render($$result, { class: "w-3 h-3 text-navy-600" }, {}, {})}` : ``}</button> <div class="flex-1 min-w-0"><div class="flex items-center gap-2"><h3 class="${"text-base text-navy-900 truncate " + escape(
    task.status === "completed" ? "line-through text-navy-400" : "",
    true
  )}">${escape(task.title)}</h3> ${isOverdue && task.status !== "completed" && task.dueDate ? `${validate_component(TaskLeadTime, "TaskLeadTime").$$render($$result, { dueDate: task.dueDate }, {}, {})}` : ``}</div> <div class="flex flex-wrap gap-2 mt-1">${task.labels?.length ? `<div class="flex gap-1 flex-wrap">${each(task.labels, (label) => {
    return `<span class="flex items-center gap-1 text-xs bg-navy-50 text-navy-700 px-1.5 py-0.5 rounded">${validate_component(Tag, "Tag").$$render($$result, { class: "w-3 h-3" }, {}, {})} ${escape(label)} </span>`;
  })}</div>` : ``} ${task.recurrence && task.dueDate ? `${validate_component(RecurringInfo, "RecurringInfo").$$render(
    $$result,
    {
      recurrence: task.recurrence,
      nextDueDate: task.dueDate
    },
    {},
    {}
  )}` : ``}</div></div> <button class="p-2 hover:bg-red-50 rounded text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete task">${validate_component(Trash_2, "Trash2").$$render($$result, { class: "w-4 h-4" }, {}, {})}</button></div>`;
});
export {
  TaskItem as T
};
