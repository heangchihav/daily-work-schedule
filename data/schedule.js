// ==========================================
// ENUMS (Standard Constants)
// ==========================================
const TaskType = {
    ROUTINE: 'routine',
    WORK: 'work',
    BREAK: 'break',
    FREE_TIME: 'free'
};

const Days = {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday',
    ANY: 'Any'
};

// ==========================================
// REUSABLE BLOCKS (Change once, updates everywhere)
// ==========================================
const CommonBlocks = {
    windDown: { start: "00:00", end: "01:00", title: "Free Time", type: TaskType.FREE_TIME, colorClass: "task-free" },
    sleep: { start: "01:00", end: "06:30", title: "Sleep", type: TaskType.BREAK, colorClass: "task-sleep" },
    nisMorning: { start: "07:00", end: "11:30", title: "Work at NIS", type: TaskType.WORK, colorClass: "task-nis" },
    lunch: { start: "11:30", end: "12:00", title: "Lunch", type: TaskType.BREAK, colorClass: "task-lunch" },
    gym: { start: "12:00", end: "13:00", title: "Gym", type: TaskType.ROUTINE, colorClass: "task-gym" },
    freeTimeMidday: { start: "13:00", end: "13:30", title: "Free Time", type: TaskType.FREE_TIME, colorClass: "task-free" },
    nisAfternoon: { start: "13:30", end: "17:00", title: "Work at NIS", type: TaskType.WORK, colorClass: "task-nis" },
    vetNight: { start: "17:00", end: "24:00", title: "Work at VET", type: TaskType.WORK, colorClass: "task-vet" }
};

// ==========================================
// WEEKLY SCHEDULE DEFINITION
// ==========================================
const rawFixedTasks = {
    [Days.MONDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.nisMorning,
        CommonBlocks.lunch,
        CommonBlocks.gym,
        CommonBlocks.freeTimeMidday,
        CommonBlocks.nisAfternoon,
        CommonBlocks.vetNight
    ],
    [Days.TUESDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.nisMorning,
        CommonBlocks.lunch,
        CommonBlocks.gym,
        CommonBlocks.freeTimeMidday,
        CommonBlocks.nisAfternoon,
        CommonBlocks.vetNight
    ],
    [Days.WEDNESDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.nisMorning,
        CommonBlocks.lunch,
        CommonBlocks.gym,
        CommonBlocks.freeTimeMidday,
        CommonBlocks.nisAfternoon,
        CommonBlocks.vetNight
    ],
    [Days.THURSDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.nisMorning,
        CommonBlocks.lunch,
        CommonBlocks.gym,
        CommonBlocks.freeTimeMidday,
        CommonBlocks.nisAfternoon,
        CommonBlocks.vetNight
    ],
    [Days.FRIDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.nisMorning,
        CommonBlocks.lunch,
        CommonBlocks.gym,
        CommonBlocks.freeTimeMidday,
        CommonBlocks.nisAfternoon,
        CommonBlocks.vetNight
    ],
    [Days.SATURDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.vetNight
    ],
    [Days.SUNDAY]: [
        // Sunday is fully free by default
    ]
};

// ==========================================
// FLOATING TASKS
// ==========================================
let floatingTasks = [
    // "Ej" - Mon, Wed, Fri, Sat (Gym / Workout)
    { title: "Ej", targetDay: Days.MONDAY, targetTime: "", completed: false, colorClass: "task-gym" },
    { title: "Ej", targetDay: Days.WEDNESDAY, targetTime: "", completed: false, colorClass: "task-gym" },
    { title: "Ej", targetDay: Days.FRIDAY, targetTime: "", completed: false, colorClass: "task-gym" },
    { title: "Ej", targetDay: Days.SATURDAY, targetTime: "", completed: false, colorClass: "task-gym" },
    
    // Check email - Everyday
    { title: "Check email", targetDay: Days.MONDAY, targetTime: "", completed: false, colorClass: "task-email" },
    { title: "Check email", targetDay: Days.TUESDAY, targetTime: "", completed: false, colorClass: "task-email" },
    { title: "Check email", targetDay: Days.WEDNESDAY, targetTime: "", completed: false, colorClass: "task-email" },
    { title: "Check email", targetDay: Days.THURSDAY, targetTime: "", completed: false, colorClass: "task-email" },
    { title: "Check email", targetDay: Days.FRIDAY, targetTime: "", completed: false, colorClass: "task-email" },
    { title: "Check email", targetDay: Days.SATURDAY, targetTime: "", completed: false, colorClass: "task-email" },
    { title: "Check email", targetDay: Days.SUNDAY, targetTime: "", completed: false, colorClass: "task-email" },

    // Sunday chores
    { title: "Clean toilet", targetDay: Days.SUNDAY, targetTime: "", completed: false, colorClass: "task-chore" },
    { title: "Do laundry", targetDay: Days.SUNDAY, targetTime: "", completed: false, colorClass: "task-chore" },

    // Work at VET (Mon-Sat, 5 PM - 12 AM)
    { title: "Work at VET", targetDay: Days.MONDAY, targetTime: "17:00 - 00:00", completed: false, colorClass: "task-vet" },
    { title: "Work at VET", targetDay: Days.TUESDAY, targetTime: "17:00 - 00:00", completed: false, colorClass: "task-vet" },
    { title: "Work at VET", targetDay: Days.WEDNESDAY, targetTime: "17:00 - 00:00", completed: false, colorClass: "task-vet" },
    { title: "Work at VET", targetDay: Days.THURSDAY, targetTime: "17:00 - 00:00", completed: false, colorClass: "task-vet" },
    { title: "Work at VET", targetDay: Days.FRIDAY, targetTime: "17:00 - 00:00", completed: false, colorClass: "task-vet" },
    { title: "Work at VET", targetDay: Days.SATURDAY, targetTime: "17:00 - 00:00", completed: false, colorClass: "task-vet" }
];

// ==========================================
// AUTO-PROCESSOR (Do not modify manually)
// ==========================================
const fixedTasks = {};

// Process and sort fixed tasks
for (const [day, tasks] of Object.entries(rawFixedTasks)) {
    // 1. Clone tasks to avoid mutating the shared CommonBlocks
    // 2. Sort by start time
    fixedTasks[day] = tasks.map(t => ({ ...t })).sort((a, b) => a.start.localeCompare(b.start));
    
    // 3. Auto-assign IDs
    fixedTasks[day].forEach((task, index) => {
        task.id = `${day.toLowerCase().substring(0,3)}${index + 1}`;
    });
}

// Auto-assign floating IDs
floatingTasks = floatingTasks.map((task, index) => ({
    ...task,
    id: `fl${index + 1}`
}));

// Export globally
window.scheduleData = {
    fixedTasks,
    floatingTasks,
    TaskType,
    Days
};
