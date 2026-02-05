package main

import "time"

type Settings struct {
	WorkSession      time.Duration
	LongRestSession  time.Duration
	ShortRestSession time.Duration
	Cycle            []string
}

func NewSettings() *Settings {
	return &Settings{
		WorkSession:      20 * time.Minute,
		LongRestSession:  15 * time.Minute,
		ShortRestSession: 5 * time.Minute,
		Cycle:            []string{"Work", "Short Rest", "Work", "Short Rest", "Work", "Short Rest", "Work", "Long Rest"},
	}
}

func (s *Settings) GetSettings() *Settings {
	return s
}
