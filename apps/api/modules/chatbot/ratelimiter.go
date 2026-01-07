package chatbot

import (
	"sync"
	"time"
)

type RateLimiter struct {
	mu           sync.RWMutex
	userLimits   map[uint]*userLimit
	maxRequests  int
	windowPeriod time.Duration
}

type userLimit struct {
	count     int
	windowEnd time.Time
}

func NewRateLimiter(maxRequests int, windowPeriod time.Duration) *RateLimiter {
	return &RateLimiter{
		userLimits:   make(map[uint]*userLimit),
		maxRequests:  maxRequests,
		windowPeriod: windowPeriod,
	}
}

func (rl *RateLimiter) Allow(userID uint) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()

	limit, exists := rl.userLimits[userID]
	if !exists || now.After(limit.windowEnd) {
		rl.userLimits[userID] = &userLimit{
			count:     1,
			windowEnd: now.Add(rl.windowPeriod),
		}
		return true
	}

	if limit.count >= rl.maxRequests {
		return false
	}

	limit.count++
	return true
}

func (rl *RateLimiter) GetRemaining(userID uint) (remaining int, resetTime time.Time) {
	rl.mu.RLock()
	defer rl.mu.RUnlock()

	limit, exists := rl.userLimits[userID]
	if !exists {
		return rl.maxRequests, time.Now().Add(rl.windowPeriod)
	}

	if time.Now().After(limit.windowEnd) {
		return rl.maxRequests, time.Now().Add(rl.windowPeriod)
	}

	return rl.maxRequests - limit.count, limit.windowEnd
}

func (rl *RateLimiter) Cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	for userID, limit := range rl.userLimits {
		if now.After(limit.windowEnd) {
			delete(rl.userLimits, userID)
		}
	}
}
