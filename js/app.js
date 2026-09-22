document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let scheduleData = { fixedTasks: {}, floatingTasks: [] };
    let currentDayStr = "";
    
    // --- DOM Elements ---
    const timeDisplay = document.getElementById('current-time');
    const dayDisplay = document.getElementById('current-day');
    const dateDisplay = document.getElementById('current-date');
    
    const taskTitle = document.getElementById('current-task-title');
    const taskTime = document.getElementById('current-task-time');
    const taskType = document.getElementById('current-task-type');
    const progressBar = document.getElementById('task-progress');
    const timeRemaining = document.getElementById('time-remaining');
    
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    

    const floatingTodayList = document.getElementById('floating-today-list');
    const floatingList = document.getElementById('floating-tasks-list');
    const weekGrid = document.getElementById('week-grid');
    const calendarHeader = document.getElementById('calendar-header');
    const timeScale = document.getElementById('time-scale');
    const floatingCount = document.getElementById('floating-count');

    // --- Initialization ---
    function init() {
        if (window.scheduleData) {
            scheduleData = window.scheduleData;
        } else {
            console.error("Error loading schedule data: window.scheduleData is missing.");
            taskTitle.textContent = "Error loading schedule.";
            return;
        }
        setupTabs();
        updateClock();
        setInterval(updateClock, 1000); // Update every second
        
        // Initial renders
        renderFloatingTasks();
        renderWeekGrid();
    }

    // --- Time & Current Task Logic ---
    function updateClock() {
        const now = new Date();
        
        // Update Time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
        
        // Update Date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = days[now.getDay()];
        if (currentDayStr !== dayName) {
            currentDayStr = dayName;
            dayDisplay.textContent = dayName;
            dateDisplay.textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

        }
        
        updateCurrentTask(now);
        updateCalendarHighlight(now);
    }

    function updateCalendarHighlight(now) {
        const currentMins = now.getHours() * 60 + now.getMinutes();
        const topPx = (currentMins / 60) * 50;
        
        // Update or create the red current-time line
        let timeLine = document.getElementById('current-time-line');
        if (!timeLine && weekGrid) {
            timeLine = document.createElement('div');
            timeLine.id = 'current-time-line';
            timeLine.className = 'current-time-line';
            weekGrid.appendChild(timeLine);
        }
        if (timeLine) {
            timeLine.style.top = `${topPx}px`;
        }

        // Highlight the currently active block in the calendar and dim past blocks
        const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const currentDayIndex = daysOrder.indexOf(currentDayStr);

        const blocks = document.querySelectorAll('.cal-task-block');
        blocks.forEach(block => {
            block.classList.remove('cal-active-glow', 'cal-past-dim');
            const day = block.dataset.day;
            const start = parseInt(block.dataset.start);
            const end = parseInt(block.dataset.end);
            
            const blockDayIndex = daysOrder.indexOf(day);

            // Check if block is currently active
            if (day === currentDayStr && currentMins >= start && currentMins < end) {
                block.classList.add('cal-active-glow');
            } 
            // Check if block is in the past
            else if (
                blockDayIndex < currentDayIndex || 
                (blockDayIndex === currentDayIndex && currentMins >= end)
            ) {
                block.classList.add('cal-past-dim');
            }
        });
    }

    function updateCurrentTask(now) {
        if (!scheduleData.fixedTasks[currentDayStr]) return;

        const currentTasks = scheduleData.fixedTasks[currentDayStr];
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

        let activeTask = null;

        for (const task of currentTasks) {
            const startMins = parseTime(task.start);
            const endMins = parseTime(task.end);

            if (currentTimeMinutes >= startMins && currentTimeMinutes < endMins) {
                activeTask = task;
                break;
            }
        }

        if (activeTask) {
            taskTitle.textContent = activeTask.title;
            taskTime.innerHTML = `<i class="fa-regular fa-clock"></i> ${activeTask.start} - ${activeTask.end}`;
            taskType.textContent = activeTask.type;
            taskType.className = `type-badge ${activeTask.type}`;
            
            // Calculate progress
            const startMins = parseTime(activeTask.start);
            const endMins = parseTime(activeTask.end);
            const totalDuration = endMins - startMins;
            const elapsed = currentTimeMinutes - startMins;
            const progressPercent = (elapsed / totalDuration) * 100;
            
            progressBar.style.width = `${progressPercent}%`;
            
            const remainingMins = endMins - currentTimeMinutes;
            timeRemaining.textContent = `${remainingMins} min remaining`;
        } else {
            taskTitle.textContent = "Free Time / Open Routine";
            taskTime.innerHTML = `<i class="fa-solid fa-mug-hot"></i> No scheduled block`;
            taskType.textContent = "free";
            taskType.className = `type-badge`;
            progressBar.style.width = `0%`;
            timeRemaining.textContent = "";
        }
        
    }

    function parseTime(timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    }

    // --- Rendering Logic ---


    function renderFloatingTasks() {
        floatingTodayList.innerHTML = '';
        floatingList.innerHTML = '';
        const tasks = scheduleData.floatingTasks || [];
        
        // Update notification count
        const activeCount = tasks.filter(t => !t.completed).length;
        floatingCount.textContent = activeCount;
        
        if (tasks.length === 0) {
            floatingList.innerHTML = '<p>No floating tasks. You are all caught up!</p>';
            return;
        }

        let todayCount = 0;
        let otherCount = 0;

        tasks.forEach((task, index) => {
            const card = document.createElement('div');
            card.className = `floating-card ${task.completed ? 'completed' : ''}`;
            
            let timeStr = task.targetTime ? ` at ${task.targetTime}` : '';
            let targetText = `${task.targetDay}${timeStr}`;
            
            let deadlineColor = 'var(--accent-tertiary)';
            if(task.targetDay === currentDayStr) deadlineColor = 'var(--warning)';
            
            card.innerHTML = `
                <div class="floating-card-header">
                    <h4>${task.title}</h4>
                    <div class="checkbox-custom">
                        <i class="fa-solid fa-check"></i>
                    </div>
                </div>
                <span class="deadline-badge" style="background: ${deadlineColor}20; color: ${deadlineColor}">${targetText}</span>
            `;
            
            card.addEventListener('click', () => {
                scheduleData.floatingTasks[index].completed = !scheduleData.floatingTasks[index].completed;
                renderFloatingTasks(); 
            });
            
            if (task.targetDay === currentDayStr || task.targetDay === 'Any') {
                floatingTodayList.appendChild(card);
                todayCount++;
            } else {
                floatingList.appendChild(card);
                otherCount++;
            }
        });

        if (todayCount === 0) floatingTodayList.innerHTML = '<p>No floating tasks due today.</p>';
        if (otherCount === 0) floatingList.innerHTML = '<p>No other floating tasks.</p>';
    }

    function renderWeekGrid() {
        calendarHeader.innerHTML = '<div class="cal-header-day" style="border-left:none; font-size: 0.85rem; padding: 1rem 0; color: var(--text-muted);">Time</div>'; // Corner
        timeScale.innerHTML = '';
        weekGrid.innerHTML = '';
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        // Render Header
        days.forEach(day => {
            calendarHeader.innerHTML += `<div class="cal-header-day">${day.substring(0,3)}</div>`;
        });

        // Render Time Scale (00:00 to 23:00)
        for (let i = 0; i < 24; i++) {
            const hour = String(i).padStart(2, '0');
            const topPos = i * 50; // 50px per hour
            timeScale.innerHTML += `<div class="time-slot" style="top: ${topPos}px">${hour}:00</div>`;
        }

        // Render Grid Columns and Tasks
        days.forEach(day => {
            const col = document.createElement('div');
            col.className = 'cal-col';
            
            let tasks = scheduleData.fixedTasks[day] || [];
            
            // Sort tasks to reliably find gaps
            tasks.sort((a, b) => parseTime(a.start) - parseTime(b.start));

            let lastEndMins = 0;

            tasks.forEach(task => {
                const startMins = parseTime(task.start);
                let endMins = parseTime(task.end);
                
                if (task.end === '24:00' || task.end === '00:00') {
                    endMins = 24 * 60; // handle midnight
                }

                // Inject Free Time block if there's a gap
                if (startMins > lastEndMins) {
                    createBlock(col, day, lastEndMins, startMins, { title: 'Free Time', type: 'free' });
                }

                // Render actual task
                createBlock(col, day, startMins, endMins, task);
                
                lastEndMins = Math.max(lastEndMins, endMins);
            });
            
            // Fill any remaining time till midnight with Free Time
            if (lastEndMins < 24 * 60) {
                createBlock(col, day, lastEndMins, 24 * 60, { title: 'Free Time', type: 'free' });
            }
            
            weekGrid.appendChild(col);
        });
    }

    function createBlock(container, day, startMins, endMins, task) {
        const topPx = (startMins / 60) * 50;
        const durationPx = ((endMins - startMins) / 60) * 50;
        
        const block = document.createElement('div');
        block.className = `cal-task-block ${task.type}`;
        block.style.top = `${topPx}px`;
        block.style.height = `${durationPx}px`;
        block.dataset.day = day;
        block.dataset.start = startMins;
        block.dataset.end = endMins;
        
        block.innerHTML = `<h5>${task.title}</h5>`;
        
        container.appendChild(block);
    }

    // --- Tab Switching ---
    function setupTabs() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // Start App
    init();

    // --- Service Worker Registration for PWA ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').then((registration) => {
                console.log('ServiceWorker registered with scope: ', registration.scope);
            }).catch((err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});
