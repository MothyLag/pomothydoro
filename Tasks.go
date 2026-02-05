package main

import (
	"time"
)

type Tasks struct {
	Tasks []Task
}

type Task struct {
	ID          int8
	Title       string
	Description string
	DueDate     time.Time
	Status      string
}

func newTask() *Tasks {
	return &Tasks{
		Tasks: []Task{},
	}
}

func (t *Tasks) AddTask(task *Task) {
	t.Tasks = append(t.Tasks, *task)
}

func (t *Tasks) GetTask(id int8) *Task {
	for _, task := range t.Tasks {
		if task.ID == id {
			return &task
		}
	}
	return nil
}

func (t *Tasks) UpdateTask(id int8, newTaskState *Task) {
	for i, task := range t.Tasks {
		if task.ID == id {
			t.Tasks[i] = *newTaskState
			return
		}
	}
}

func (t *Tasks) DeleteTask(id int8) {
	for i, task := range t.Tasks {
		if task.ID == id {
			t.Tasks = append(t.Tasks[:i], t.Tasks[i+1:]...)
			return
		}
	}
}
