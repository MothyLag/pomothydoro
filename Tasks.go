package main

type Tasks struct {
	Tasks    []Task
	nextId   int
	ActiveId int
}

type Task struct {
	ID                int
	Title             string
	Completed         bool
	WorkSessions      int
	ShortRestSessions int
	LongRestSessions  int
	Cycles            int
}

func NewTasks() *Tasks {
	return &Tasks{
		Tasks:    []Task{},
		nextId:   1,
		ActiveId: -1,
	}
}

func (t *Tasks) AddTask(title string) Task {
	task := Task{
		ID:        t.nextId,
		Title:     title,
		Completed: false,
	}
	t.nextId++
	t.Tasks = append(t.Tasks, task)
	return task
}

func (t *Tasks) GetTasks() []Task {
	return t.Tasks
}

func (t *Tasks) ToggleComplete(id int) {
	for i, task := range t.Tasks {
		if task.ID == id {
			t.Tasks[i].Completed = !t.Tasks[i].Completed
			return
		}
	}
}

func (t *Tasks) DeleteTask(id int) {
	for i, task := range t.Tasks {
		if task.ID == id {
			t.Tasks = append(t.Tasks[:i], t.Tasks[i+1:]...)
			return
		}
	}
}

func (t *Tasks) SetActiveTask(id int) {
	t.ActiveId = id
}

func (t *Tasks) GetActiveTask() int {
	return t.ActiveId
}

func (t *Tasks) IncrementSession(id int, sessionType string) {
	for i, task := range t.Tasks {
		if task.ID == id {
			switch sessionType {
			case "Work":
				t.Tasks[i].WorkSessions++
			case "Short Rest":
				t.Tasks[i].ShortRestSessions++
			case "Long Rest":
				t.Tasks[i].LongRestSessions++
			}
			return
		}
	}
}
