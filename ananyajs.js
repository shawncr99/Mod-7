const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class Task {
    constructor(title, priority = "medium") {
        this.id = crypto.randomUUID();
        this.title = title;
        this.priority = priority;
        this.createdAt = new Date();
        this.completed = false;
    }

    markComplete() {
        this.completed = true;
    }

    get urgencyScore() {
        const priorityWeight = {
            high: 3,
            medium: 2,
            low: 1
        };

        const ageInMinutes = (Date.now() - this.createdAt.getTime()) / 60000;
        return priorityWeight[this.priority] * 10 + ageInMinutes;
    }
}

class TaskManager {
    constructor() {
        if (TaskManager.instance) {
            return TaskManager.instance;
        }
        this.tasks = [];
        TaskManager.instance = this;
    }

    addTask(title, priority) {
        const task = new Task(title, priority);
        this.tasks.push(task);
        return task;
    }

    async autoPrioritize() {
        await delay(1000);
        this.tasks.sort((a, b) => b.urgencyScore - a.urgencyScore);
    }

    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) throw new Error("Task not found");
        task.markComplete();
    }

    get pendingTasks() {
        return this.tasks.filter(task => !task.completed);
    }

    get summary() {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.pendingTasks.length
        };
    }
}

(async () => {
    const manager = new TaskManager();

    manager.addTask("Build AI Portfolio", "high");
    manager.addTask("Practice DSA", "high");
    manager.addTask("Watch Netflix", "low");
    manager.addTask("Revise JavaScript", "medium");

    await manager.autoPrioritize();

    console.table(manager.tasks.map(t => ({
        title: t.title,
        priority: t.priority,
        urgency: t.urgencyScore.toFixed(2),
        completed: t.completed
    })));

    console.log(manager.summary);
})();
