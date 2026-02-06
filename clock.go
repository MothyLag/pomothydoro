package main

import (
	"fmt"
	"time"
)

type Clock struct {
	Sessions        []Session
	currentSession  int8
	paused          bool
	pausedRemaining time.Duration
}

var settings Settings

type Session struct {
	taskId      int8
	ID          int8
	Start       time.Time
	End         time.Time
	Description string
}

func NewClock(s *Settings) *Clock {
	settings = *s
	return &Clock{
		Sessions:       make([]Session, 0),
		currentSession: -1,
	}
}

func (c *Clock) StartSession(description string) int {
	c.currentSession++
	session := Session{
		ID:          c.currentSession,
		taskId:      c.currentSession,
		Start:       time.Now(),
		End:         time.Time{},
		Description: description,
	}
	c.Sessions = append(c.Sessions, session)
	return getLimitTimeByDescription(description, settings)
}

func (c *Clock) GetCurrentCycle() string {
	cycleCount := len(settings.Cycle)
	currentSession := len(c.Sessions)
	round := currentSession / cycleCount
	return settings.Cycle[(currentSession - (round * cycleCount))]
}

func (c *Clock) GetNextCycle() string {
	cycleCount := len(settings.Cycle)
	currentSession := len(c.Sessions)
	round := currentSession / cycleCount
	fmt.Println("GetNextCycle:", currentSession, cycleCount, round)
	return settings.Cycle[(currentSession - (round * cycleCount))]
}

func getLimitTimeByDescription(description string, s Settings) int {
	switch description {
	case "Work":
		return int(s.WorkSession)
	case "Short Rest":
		return int(s.ShortRestSession)
	case "Long Rest":
		return int(s.LongRestSession)
	default:
		return 0
	}
}

func (c *Clock) GetLimitTimeByDescription(description string) int {
	return getLimitTimeByDescription(description, settings)
}

func (c *Clock) StopSession() string {
	if c.currentSession >= 0 {
		endTime := time.Now()
		currSession := c.Sessions[c.currentSession]
		currSession.End = endTime
		c.Sessions[c.currentSession] = currSession
		c.paused = false
	}
	return c.GetCurrentCycle()
}

func (c *Clock) PauseSession(limitTime int) string {
	if c.currentSession >= 0 && !c.paused {
		startTime := c.Sessions[c.currentSession].Start
		elapsed := time.Since(startTime)
		c.pausedRemaining = time.Duration(limitTime) - elapsed
		c.paused = true
	}
	return c.GetTime(limitTime)
}

func (c *Clock) ResumeSession(limitTime int) {
	if c.currentSession >= 0 && c.paused {
		elapsed := time.Duration(limitTime) - c.pausedRemaining
		c.Sessions[c.currentSession].Start = time.Now().Add(-elapsed)
		c.paused = false
	}
}

func (c *Clock) IsPaused() bool {
	return c.paused
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	neg := n < 0
	if neg {
		n = -n
	}
	b := make([]byte, 0, 20)
	for n > 0 {
		d := n % 10
		b = append(b, byte('0'+d))
		n /= 10
	}
	if neg {
		b = append(b, '-')
	}
	// reverse
	for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
		b[i], b[j] = b[j], b[i]
	}
	return string(b)
}

func (c *Clock) GetNewTime(limitTime int) string {
	duration := time.Duration(limitTime)
	min := (duration % time.Hour) / time.Minute
	sec := (duration % time.Minute) / time.Second
	minS := itoa(int(min))
	if len(minS) < 2 {
		if len(minS) == 0 {
			minS = "00"
		} else {
			minS = "0" + minS
		}
	}

	secS := itoa(int(sec))
	if len(secS) < 2 {
		if len(secS) == 0 {
			secS = "00"
		} else {
			secS = "0" + secS
		}
	}
	return minS + ":" + secS
}

func (c *Clock) GetTime(limitTime int) string {
	duration := time.Duration(limitTime)
	if c.currentSession >= 0 {
		if c.paused {
			duration = c.pausedRemaining
		} else {
			startTime := c.Sessions[c.currentSession].Start
			duration = time.Duration(limitTime) - time.Since(startTime)
		}
	}

	min := (duration % time.Hour) / time.Minute
	sec := (duration % time.Minute) / time.Second

	minS := itoa(int(min))
	if len(minS) < 2 {
		if len(minS) == 0 {
			minS = "00"
		} else {
			minS = "0" + minS
		}
	}

	secS := itoa(int(sec))
	if len(secS) < 2 {
		if len(secS) == 0 {
			secS = "00"
		} else {
			secS = "0" + secS
		}
	}
	return minS + ":" + secS
}

func (c *Clock) GetRemainingMs(limitTime int) int {
	if c.currentSession < 0 {
		return limitTime / int(time.Millisecond)
	}
	if c.paused {
		return int(c.pausedRemaining / time.Millisecond)
	}
	startTime := c.Sessions[c.currentSession].Start
	remaining := time.Duration(limitTime) - time.Since(startTime)
	return int(remaining / time.Millisecond)
}

func (c *Clock) GetNextCycleAndAdvance() string {
	if c.currentSession >= 0 {
		endTime := time.Now()
		currSession := c.Sessions[c.currentSession]
		currSession.End = endTime
		c.Sessions[c.currentSession] = currSession
		c.paused = false
	}
	return c.GetNextCycle()
}

func (c *Clock) GetSessions() []Session {
	if c.currentSession >= 0 {
		return c.Sessions
	}
	return []Session{}
}
