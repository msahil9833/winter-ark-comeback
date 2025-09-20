// Winter Ark Comeback - CORRECTED JavaScript File

class WinterArkApp {
    constructor() {
        this.currentDate = new Date();
        this.targetDate = new Date('2026-01-01T00:00:00');
        this.calendarCurrentMonth = new Date().getMonth();
        this.calendarCurrentYear = new Date().getFullYear();

        // Motivational quotes for incomplete tasks
        this.motivationalQuotes = [
            "Tomorrow is a chance to do better. Don't give up! ❄️",
            "Every small step counts. Keep pushing forward! 🌟",
            "The comeback is always stronger than the setback! 💪",
            "Winter teaches us that after every ending comes a new beginning! 🌨️",
            "You're closer than you were yesterday. Keep going! 🎯",
            "Great achievements require great dedication! ✨",
            "The journey of a thousand miles begins with a single step! 🚀",
            "Your future self is counting on you today! ⏰",
            "Champions are made when nobody's watching! 🏆",
            "The best time to plant a tree was 20 years ago. The second best time is now! 🌱"
        ];

        this.init();
    }

    init() {
        this.updateCountdown();
        this.updateCurrentDate();
        this.loadTodaysTasks();
        this.setupEventListeners();
        this.initializeCalendar();
        this.updateProgress();

        // Update countdown every second
        setInterval(() => this.updateCountdown(), 1000);
    }

    // Countdown Timer Functions
    updateCountdown() {
        const now = new Date().getTime();
        const target = this.targetDate.getTime();
        const distance = target - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }

    // Date Functions
    updateCurrentDate() {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('current-date').textContent = 
            new Date().toLocaleDateString('en-US', options);
    }

    getTodayKey() {
        return new Date().toDateString();
    }

    // Task Management Functions
    setupEventListeners() {
        const addTaskBtn = document.getElementById('add-task-btn');
        const taskInput = document.getElementById('task-input');

        addTaskBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.navigateMonth(1));
    }

    addTask() {
        const taskInput = document.getElementById('task-input');
        const taskText = taskInput.value.trim();

        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        let tasks = this.getTodaysTasks();
        tasks.push(task);
        this.saveTodaysTasks(tasks);

        taskInput.value = '';
        this.renderTasks();
        this.updateProgress();
    }

    getTodaysTasks() {
        const todayKey = this.getTodayKey();
        const tasks = localStorage.getItem(`tasks_${todayKey}`);
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTodaysTasks(tasks) {
        const todayKey = this.getTodayKey();
        localStorage.setItem(`tasks_${todayKey}`, JSON.stringify(tasks));

        // Also save daily completion data for calendar
        this.saveDailyProgress(tasks);
    }

    saveDailyProgress(tasks) {
        const todayKey = this.getTodayKey();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        const progressData = {
            date: todayKey,
            total: totalTasks,
            completed: completedTasks,
            completionRate: completionRate,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(`progress_${todayKey}`, JSON.stringify(progressData));
    }

    toggleTask(taskId) {
        let tasks = this.getTodaysTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            this.saveTodaysTasks(tasks);
            this.renderTasks();
            this.updateProgress();
        }
    }

    deleteTask(taskId) {
        let tasks = this.getTodaysTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        this.saveTodaysTasks(tasks);
        this.renderTasks();
        this.updateProgress();
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        const tasks = this.getTodaysTasks();

        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 opacity-60">
                    <div class="text-4xl mb-2">📝</div>
                    <p>No tasks for today. Add one above!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200 group">
                <button 
                    onclick="app.toggleTask(${task.id})"
                    class="flex-shrink-0 w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center transition-all duration-200 ${
                        task.completed 
                            ? 'bg-success-green border-success-green' 
                            : 'hover:border-white/60'
                    }"
                >
                    ${task.completed ? '✓' : ''}
                </button>
                <span class="flex-1 ${task.completed ? 'line-through opacity-60' : ''} transition-all duration-200">
                    ${task.text}
                </span>
                <button 
                    onclick="app.deleteTask(${task.id})"
                    class="opacity-0 group-hover:opacity-100 p-1 text-danger-red hover:bg-danger-red/20 rounded transition-all duration-200"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    loadTodaysTasks() {
        this.renderTasks();
    }

    updateProgress() {
        const tasks = this.getTodaysTasks();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;

        if (totalTasks === 0) {
            document.getElementById('progress-text').textContent = '0%';
            document.getElementById('progress-bar').style.width = '0%';
            this.hideQuote();
            return;
        }

        const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

        document.getElementById('progress-text').textContent = `${progressPercentage}%`;
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;

        // Update progress bar color based on percentage
        const progressBar = document.getElementById('progress-bar');
        if (progressPercentage === 100) {
            progressBar.className = progressBar.className.replace(/from-\w+-\w+\s+to-\w+-\w+/, 'from-success-green to-green-400');
            this.hideQuote();
        } else if (progressPercentage >= 70) {
            progressBar.className = progressBar.className.replace(/from-\w+-\w+\s+to-\w+-\w+/, 'from-warning-amber to-orange-400');
        } else {
            progressBar.className = progressBar.className.replace(/from-\w+-\w+\s+to-\w+-\w+/, 'from-danger-red to-red-400');
        }

        // Show motivational quote at end of day if tasks incomplete
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(22, 0, 0, 0); // Show quote after 10 PM

        if (now >= endOfDay && progressPercentage < 100 && totalTasks > 0) {
            this.showMotivationalQuote();
        }
    }

    showMotivationalQuote() {
        const quoteContainer = document.getElementById('quote-container');
        const quoteElement = document.getElementById('motivational-quote');
        const randomQuote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];

        quoteElement.textContent = randomQuote;
        quoteContainer.classList.remove('hidden');

        // Add animation
        quoteContainer.style.opacity = '0';
        setTimeout(() => {
            quoteContainer.style.transition = 'opacity 0.5s ease-in-out';
            quoteContainer.style.opacity = '1';
        }, 100);
    }

    hideQuote() {
        const quoteContainer = document.getElementById('quote-container');
        quoteContainer.classList.add('hidden');
    }

    // CORRECTED Calendar Functions
    initializeCalendar() {
        this.renderCalendar();
    }

    navigateMonth(direction) {
        this.calendarCurrentMonth += direction;

        if (this.calendarCurrentMonth > 11) {
            this.calendarCurrentMonth = 0;
            this.calendarCurrentYear++;
        } else if (this.calendarCurrentMonth < 0) {
            this.calendarCurrentMonth = 11;
            this.calendarCurrentYear--;
        }

        this.renderCalendar();
    }

    renderCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Update month/year display
        document.getElementById('calendar-month-year').textContent = 
            `${monthNames[this.calendarCurrentMonth]} ${this.calendarCurrentYear}`;

        // Calculate calendar days
        const firstDay = new Date(this.calendarCurrentYear, this.calendarCurrentMonth, 1);
        const lastDay = new Date(this.calendarCurrentYear, this.calendarCurrentMonth + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const calendarDaysContainer = document.getElementById('calendar-days');
        let daysHTML = '';

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            daysHTML += '<div class="p-3 text-center"></div>';
        }

        // Days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(this.calendarCurrentYear, this.calendarCurrentMonth, day);
            const dateKey = currentDate.toDateString();
            const progressData = localStorage.getItem(`progress_${dateKey}`);
            const isToday = currentDate.toDateString() === today.toDateString();
            const isPast = currentDate < today;

            let cellClass = 'p-3 text-center rounded-lg relative transition-all duration-200 hover:bg-white/10 min-h-[40px] flex flex-col justify-center';
            let cellContent = `<div class="text-sm">${day}</div>`;

            if (isToday) {
                cellClass += ' bg-white/20 ring-2 ring-white/40 font-semibold';
            } else if (isPast) {
                cellClass += ' opacity-60';
            }

            // Add completion indicator
            if (progressData) {
                const data = JSON.parse(progressData);
                if (data.completionRate === 100) {
                    cellClass += ' bg-success-green/30 border border-success-green/50';
                    cellContent += '<div class="absolute -top-1 -right-1 text-xs text-success-green">✓</div>';
                } else if (data.total > 0) {
                    cellClass += ' bg-warning-amber/30 border border-warning-amber/50';
                    cellContent += `<div class="absolute -top-1 -right-1 text-xs text-warning-amber">${Math.round(data.completionRate)}%</div>`;
                }
            }

            daysHTML += `<div class="${cellClass}">${cellContent}</div>`;
        }

        calendarDaysContainer.innerHTML = daysHTML;
    }

    // Data Export/Import (for future GitHub Pages deployment)
    exportData() {
        const allData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('tasks_') || key.startsWith('progress_')) {
                allData[key] = localStorage.getItem(key);
            }
        }
        return JSON.stringify(allData, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, data[key]);
            });
            this.loadTodaysTasks();
            this.updateProgress();
            this.renderCalendar();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new WinterArkApp();
});

// Service Worker for offline functionality (optional for GitHub Pages)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/winter-ark-comeback/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}