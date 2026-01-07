package chatbot

import (
	"crypto/sha256"
	"encoding/hex"
	"sync"
	"time"
)

type ConversationMessage struct {
	Role      string    `json:"role"`
	Content   string    `json:"content"`
	Timestamp time.Time `json:"timestamp"`
}

type ConversationMemory struct {
	mu            sync.RWMutex
	conversations map[uint][]ConversationMessage
	maxMessages   int
	ttl           time.Duration
	lastAccess    map[uint]time.Time
}

func NewConversationMemory(maxMessages int, ttl time.Duration) *ConversationMemory {
	cm := &ConversationMemory{
		conversations: make(map[uint][]ConversationMessage),
		maxMessages:   maxMessages,
		ttl:           ttl,
		lastAccess:    make(map[uint]time.Time),
	}

	go cm.cleanupLoop()

	return cm
}

func (cm *ConversationMemory) AddMessage(userID uint, role, content string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	msg := ConversationMessage{
		Role:      role,
		Content:   content,
		Timestamp: time.Now(),
	}

	cm.conversations[userID] = append(cm.conversations[userID], msg)
	cm.lastAccess[userID] = time.Now()

	if len(cm.conversations[userID]) > cm.maxMessages {
		cm.conversations[userID] = cm.conversations[userID][len(cm.conversations[userID])-cm.maxMessages:]
	}
}

func (cm *ConversationMemory) GetHistory(userID uint) []ConversationMessage {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	cm.lastAccess[userID] = time.Now()

	if history, exists := cm.conversations[userID]; exists {
		result := make([]ConversationMessage, len(history))
		copy(result, history)
		return result
	}
	return nil
}

func (cm *ConversationMemory) Clear(userID uint) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	delete(cm.conversations, userID)
	delete(cm.lastAccess, userID)
}

func (cm *ConversationMemory) cleanupLoop() {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		cm.cleanup()
	}
}

func (cm *ConversationMemory) cleanup() {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	now := time.Now()
	for userID, lastAccess := range cm.lastAccess {
		if now.Sub(lastAccess) > cm.ttl {
			delete(cm.conversations, userID)
			delete(cm.lastAccess, userID)
		}
	}
}

type CachedResponse struct {
	Response  string
	Timestamp time.Time
}

type ResponseCache struct {
	mu      sync.RWMutex
	cache   map[string]CachedResponse
	ttl     time.Duration
	maxSize int
}

func NewResponseCache(ttl time.Duration, maxSize int) *ResponseCache {
	rc := &ResponseCache{
		cache:   make(map[string]CachedResponse),
		ttl:     ttl,
		maxSize: maxSize,
	}

	go rc.cleanupLoop()

	return rc
}

func (rc *ResponseCache) generateKey(userID uint, question string) string {
	data := []byte(string(rune(userID)) + ":" + question)
	hash := sha256.Sum256(data)
	return hex.EncodeToString(hash[:])
}

func (rc *ResponseCache) Get(userID uint, question string) (string, bool) {
	rc.mu.RLock()
	defer rc.mu.RUnlock()

	key := rc.generateKey(userID, question)
	if cached, exists := rc.cache[key]; exists {
		if time.Since(cached.Timestamp) < rc.ttl {
			return cached.Response, true
		}
	}
	return "", false
}

func (rc *ResponseCache) Set(userID uint, question, response string) {
	rc.mu.Lock()
	defer rc.mu.Unlock()

	if len(rc.cache) >= rc.maxSize {
		var oldestKey string
		var oldestTime time.Time
		for k, v := range rc.cache {
			if oldestKey == "" || v.Timestamp.Before(oldestTime) {
				oldestKey = k
				oldestTime = v.Timestamp
			}
		}
		if oldestKey != "" {
			delete(rc.cache, oldestKey)
		}
	}

	key := rc.generateKey(userID, question)
	rc.cache[key] = CachedResponse{
		Response:  response,
		Timestamp: time.Now(),
	}
}

func (rc *ResponseCache) cleanupLoop() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rc.cleanup()
	}
}

func (rc *ResponseCache) cleanup() {
	rc.mu.Lock()
	defer rc.mu.Unlock()

	now := time.Now()
	for key, cached := range rc.cache {
		if now.Sub(cached.Timestamp) > rc.ttl {
			delete(rc.cache, key)
		}
	}
}
