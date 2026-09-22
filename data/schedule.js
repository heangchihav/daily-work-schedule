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
    windDown: { start: "00:00", end: "01:00", title: "Wind Down & Relax", type: TaskType.ROUTINE },
    sleep: { start: "01:00", end: "08:00", title: "Sleep", type: TaskType.BREAK },
    breakfast: { start: "08:00", end: "09:00", title: "Wake Up & High Protein Breakfast", type: TaskType.ROUTINE },
    gymSession: { start: "09:00", end: "10:30", title: "Workout / Gym Session", type: TaskType.ROUTINE },
    postWorkout: { start: "10:30", end: "11:00", title: "Workout + Protein", type: TaskType.ROUTINE },
    openRoutine: { start: "11:00", end: "13:00", title: "Open Routine (Do Floating Tasks)", type: TaskType.ROUTINE },
    lunch: { start: "13:00", end: "14:00", title: "Lunch", type: TaskType.BREAK },
    study: { start: "14:00", end: "16:00", title: "Personal Projects / Study", type: TaskType.WORK },
    deepWork: { start: "17:00", end: "24:00", title: "Deep Work Block", type: TaskType.WORK }
};

// ==========================================
// WEEKLY SCHEDULE DEFINITION
// ==========================================
const rawFixedTasks = {
    [Days.MONDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.breakfast,
        CommonBlocks.gymSession,
        CommonBlocks.postWorkout,
        CommonBlocks.openRoutine,
        CommonBlocks.lunch,
        CommonBlocks.study,
        CommonBlocks.deepWork
    ],
    [Days.TUESDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.breakfast,
        CommonBlocks.gymSession,
        CommonBlocks.postWorkout,
        CommonBlocks.openRoutine,
        CommonBlocks.lunch,
        CommonBlocks.study,
        CommonBlocks.deepWork
    ],
    [Days.WEDNESDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.breakfast,
        CommonBlocks.gymSession,
        CommonBlocks.postWorkout,
        CommonBlocks.openRoutine,
        CommonBlocks.lunch,
        CommonBlocks.study,
        CommonBlocks.deepWork
    ],
    [Days.THURSDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.breakfast,
        { start: "09:00", end: "10:30", title: "Workout / Active Recovery", type: TaskType.ROUTINE },
        CommonBlocks.postWorkout,
        CommonBlocks.openRoutine,
        CommonBlocks.lunch,
        CommonBlocks.study,
        CommonBlocks.deepWork
    ],
    [Days.FRIDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.breakfast,
        CommonBlocks.gymSession,
        CommonBlocks.postWorkout,
        CommonBlocks.openRoutine,
        CommonBlocks.lunch,
        CommonBlocks.study,
        CommonBlocks.deepWork
    ],
    [Days.SATURDAY]: [
        CommonBlocks.windDown,
        CommonBlocks.sleep,
        CommonBlocks.breakfast,
        { start: "09:00", end: "10:30", title: "Workout / Outdoor Activity", type: TaskType.ROUTINE },
        CommonBlocks.postWorkout,
        { start: "11:00", end: "13:00", title: "Free Time / Hobbies", type: TaskType.ROUTINE },
        CommonBlocks.lunch,
        { start: "14:00", end: "16:00", title: "Socialize / Relax", type: TaskType.BREAK },
        { start: "17:00", end: "24:00", title: "Deep Work Block (Weekend Catchup)", type: TaskType.WORK }
    ],
    [Days.SUNDAY]: [
        // Sunday is fully free by default
    ]
};

// ==========================================
// FLOATING TASKS
// ==========================================
let floatingTasks = [
    { title: "Submit expense report", targetDay: Days.TUESDAY, targetTime: "15:00", completed: false },
    { title: "Update resume", targetDay: Days.ANY, targetTime: "", completed: false },
    { title: "Read chapter 4 of design book", targetDay: Days.THURSDAY, targetTime: "20:00", completed: false },
    { title: "Reply to client feedback email", targetDay: Days.TUESDAY, targetTime: "12:00", completed: false },
    { title: "Buy protein powder", targetDay: Days.ANY, targetTime: "", completed: false },
    { title: "Research new gym routines", targetDay: Days.SUNDAY, targetTime: "14:00", completed: false }
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
