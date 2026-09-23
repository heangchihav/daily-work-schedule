// ==========================================
// ENUMS (Standard Constants)
// ==========================================
const TaskType = {
    ROUTINE: 'routine',
    WORK: 'work',
    BREAK: 'break',
    FREE_TIME: 'free-time'
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
    windDown: { start: "00:00", end: "01:00", title: "Free Time", type: TaskType.FREE_TIME },
    sleep: { start: "01:00", end: "06:30", title: "Sleep", type: TaskType.BREAK },
    morningWork: { start: "07:00", end: "11:30", title: "Day Shift Work", type: TaskType.WORK },
    workout: { start: "11:30", end: "12:00", title: "Workout", type: TaskType.ROUTINE },
    lunch: { start: "12:00", end: "13:00", title: "Lunch + Drink Protein", type: TaskType.BREAK },
    dayShiftWork: { start: "14:00", end: "17:30", title: "Day Shift Work", type: TaskType.WORK },
    nightShiftWork: { start: "17:30", end: "24:00", title: "Night Shift Work", type: TaskType.WORK }
};

// ==========================================
// WEEKLY SCHEDULE DEFINITION
// ==========================================
const rawFixedTasks = {
    [Days.MONDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.morningWork,
        CommonBlocks.workout,
        CommonBlocks.lunch,
        CommonBlocks.dayShiftWork,
        CommonBlocks.nightShiftWork
    ],
    [Days.TUESDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.morningWork,
        CommonBlocks.workout,
        CommonBlocks.lunch,
        CommonBlocks.dayShiftWork,
        CommonBlocks.nightShiftWork
    ],
    [Days.WEDNESDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.morningWork,
        CommonBlocks.workout,
        CommonBlocks.lunch,
        CommonBlocks.dayShiftWork,
        CommonBlocks.nightShiftWork
    ],
    [Days.THURSDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.morningWork,
        CommonBlocks.workout,
        CommonBlocks.lunch,
        CommonBlocks.dayShiftWork,
        CommonBlocks.nightShiftWork
    ],
    [Days.FRIDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.morningWork,
        CommonBlocks.workout,
        CommonBlocks.lunch,
        CommonBlocks.dayShiftWork,
        CommonBlocks.nightShiftWork
    ],
    [Days.SATURDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.morningWork,
        CommonBlocks.workout,
        CommonBlocks.lunch,
        CommonBlocks.dayShiftWork,
        CommonBlocks.nightShiftWork
    ],
    [Days.SUNDAY]: [
        // Sunday is fully free by default
    ]
};

// ==========================================
// FLOATING TASKS
// ==========================================
let floatingTasks = [
    // "Ej" - Mon, Wed, Fri, Sat
    { title: "Ej", targetDay: Days.MONDAY, targetTime: "", completed: false },
    { title: "Ej", targetDay: Days.WEDNESDAY, targetTime: "", completed: false },
    { title: "Ej", targetDay: Days.FRIDAY, targetTime: "", completed: false },
    { title: "Ej", targetDay: Days.SATURDAY, targetTime: "", completed: false },
    
    // Check email - Everyday
    { title: "Check email", targetDay: Days.MONDAY, targetTime: "", completed: false },
    { title: "Check email", targetDay: Days.TUESDAY, targetTime: "", completed: false },
    { title: "Check email", targetDay: Days.WEDNESDAY, targetTime: "", completed: false },
    { title: "Check email", targetDay: Days.THURSDAY, targetTime: "", completed: false },
    { title: "Check email", targetDay: Days.FRIDAY, targetTime: "", completed: false },
    { title: "Check email", targetDay: Days.SATURDAY, targetTime: "", completed: false },
    { title: "Check email", targetDay: Days.SUNDAY, targetTime: "", completed: false },

    // Sunday chores
    { title: "Clean toilet", targetDay: Days.SUNDAY, targetTime: "", completed: false },
    { title: "Do laundry", targetDay: Days.SUNDAY, targetTime: "", completed: false },

    // Manage KS (Mon-Sat, 5 PM - 12 AM)
    { title: "Manage KS", targetDay: Days.MONDAY, targetTime: "17:00 - 00:00", completed: false },
    { title: "Manage KS", targetDay: Days.TUESDAY, targetTime: "17:00 - 00:00", completed: false },
    { title: "Manage KS", targetDay: Days.WEDNESDAY, targetTime: "17:00 - 00:00", completed: false },
    { title: "Manage KS", targetDay: Days.THURSDAY, targetTime: "17:00 - 00:00", completed: false },
    { title: "Manage KS", targetDay: Days.FRIDAY, targetTime: "17:00 - 00:00", completed: false },
    { title: "Manage KS", targetDay: Days.SATURDAY, targetTime: "17:00 - 00:00", completed: false }
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
