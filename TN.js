// 全局状态管理
let currentPage = 'welcome';
let selectedPersona = null;
let currentLanguage = 'zh';
let currentChatId = null;
let chatSessions = [];

// 文本内容对象
const texts = {
    zh: {
        greeting: "早上好，旅行者",
        todayText: "今天是你的旅行之日",
        aiAssistantText: "你的AI旅行助手",
        aiSubtext: "准备帮你规划欧洲冒险之旅",
        startBtn: "开始",
        personaTitle: "对于这次欧洲旅行，什么对你来说最重要？",
        planningText: "确保行程顺利安全，时间安排合理，不出意外状况",
        socialText: "和旅伴玩得开心，留下美好回忆，拍到满意的照片",
        culturalText: "深入感受当地文化，发现独特的地方，获得内心触动",
        confirmBtn: "确认选择",
        chatHeaders: {
            planning: "规划型助手",
            social: "关系型助手", 
            cultural: "体验型助手"
        },
        welcomeMessages: {
            planning: "你好！我是你的欧洲旅行规划助手。我会帮你制定详细安全的行程计划。请告诉我你计划去欧洲哪些国家或城市？",
            social: "你好！我是你的欧洲旅行关系助手。我会帮你创造美好回忆和拍摄完美照片。请告诉我你和谁一起旅行？",
            cultural: "你好！我是你的欧洲旅行体验助手。我会帮你发现独特的当地文化体验。请告诉我你对哪种文化体验最感兴趣？"
        },
        inputPlaceholder: "输入你的问题...",
        sendBtn: "发送",
        chatHistoryTitle: "聊天记录",
        newChatBtn: "新对话"
    },
    en: {
        greeting: "Good Morning, Traveler",
        todayText: "Today is your day of travel",
        aiAssistantText: "Your AI Travel Assistant", 
        aiSubtext: "Ready to help plan your European adventure",
        startBtn: "START",
        personaTitle: "What matters most to you for this European trip?",
        planningText: "Ensure smooth and safe itinerary with reasonable time arrangements and no unexpected situations",
        socialText: "Have fun with travel companions, create beautiful memories, and take satisfying photos",
        culturalText: "Experience local culture deeply, discover unique places, and gain inner inspiration",
        confirmBtn: "Confirm Selection",
        chatHeaders: {
            planning: "Planning Assistant",
            social: "Social Assistant",
            cultural: "Cultural Assistant"
        },
        welcomeMessages: {
            planning: "Hello! I'm your European travel planning assistant. I'll help you create detailed and safe itinerary plans. Which European countries or cities are you planning to visit?",
            social: "Hello! I'm your European travel social assistant. I'll help you create beautiful memories and perfect photos. Who are you traveling with?",
            cultural: "Hello! I'm your European travel cultural assistant. I'll help you discover unique local cultural experiences. What kind of cultural experience interests you most?"
        },
        inputPlaceholder: "Type your question...",
        sendBtn: "Send",
        chatHistoryTitle: "Chat History",
        newChatBtn: "New Chat"
    }
};

// 初始化
function init() {
    updateTime();
    setInterval(updateTime, 1000);
    updateTexts();
    loadChatSessions();
    setupTextarea();
}

// 设置文本域自动调整高度
function setupTextarea() {
    const textarea = document.getElementById('messageInput');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// 更新所有文本内容
function updateTexts() {
    const t = texts[currentLanguage];
    
    const elements = {
        'greeting': t.greeting,
        'todayText': t.todayText,
        'aiAssistantText': t.aiAssistantText,
        'aiSubtext': t.aiSubtext,
        'startBtn': t.startBtn,
        'personaTitle': t.personaTitle,
        'planningText': t.planningText,
        'socialText': t.socialText,
        'culturalText': t.culturalText,
        'confirmBtn': t.confirmBtn,
        'sendBtn': t.sendBtn,
        'chatHistoryTitle': t.chatHistoryTitle,
        'newChatBtn': t.newChatBtn
    };

    Object.entries(elements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    });

    // 更新语言按钮
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'zh' ? 'EN' : '中';
    }

    // 更新输入框占位符
    const input = document.getElementById('messageInput');
    if (input) input.placeholder = t.inputPlaceholder;
    
    // 更新聊天界面文本（如果已选择persona）
    if (selectedPersona) {
        const chatHeader = document.getElementById('chatHeader');
        if (chatHeader) chatHeader.textContent = t.chatHeaders[selectedPersona];
        
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (welcomeMsg) welcomeMsg.textContent = t.welcomeMessages[selectedPersona];
    }
    
    // 重新渲染聊天历史以更新语言
    renderChatHistory();
}

// 语言切换
function toggleLanguage() {
    currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
    updateTexts();
}

// 显示persona选择页面
function showPersonaSelection() {
    document.getElementById('welcomePage').classList.remove('active');
    document.getElementById('personaPage').classList.add('active');
    currentPage = 'persona';
}

// 选择persona
function selectPersona(type) {
    // 移除之前的选择
    document.querySelectorAll('.persona-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // 添加当前选择
    document.getElementById(type + 'Option').classList.add('selected');
    selectedPersona = type;
    
    // 启用确认按钮
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = false;
    confirmBtn.style.opacity = '1';
}

// 确认persona选择
function confirmPersona() {
    if (!selectedPersona) return;
    
    document.getElementById('personaPage').classList.remove('active');
    document.getElementById('chatPage').classList.add('active');
    currentPage = 'chat';
    
    // 创建新的聊天会话
    createNewChat();
}

// 创建新聊天
function createNewChat() {
    const chatId = 'chat_' + Date.now();
    const t = texts[currentLanguage];
    
    const newChat = {
        id: chatId,
        persona: selectedPersona,
        title: t.chatHeaders[selectedPersona] || 'New Chat',
        messages: [{
            text: t.welcomeMessages[selectedPersona] || 'Hello! How can I help you?',
            sender: 'ai',
            timestamp: new Date()
        }],
        createdAt: new Date(),
        lastMessage: t.welcomeMessages[selectedPersona] || 'Hello! How can I help you?'
    };
    
    chatSessions.unshift(newChat);
    currentChatId = chatId;
    
    updateChatInterface();
    renderChatHistory();
    saveChatSessions();
}

// 切换聊天会话
function switchToChat(chatId) {
    currentChatId = chatId;
    const chat = chatSessions.find(c => c.id === chatId);
    if (chat) {
        selectedPersona = chat.persona;
        updateChatInterface();
        renderChatHistory();
    }
}

// 更新聊天界面
function updateChatInterface() {
    const chat = chatSessions.find(c => c.id === currentChatId);
    if (!chat) return;

    const t = texts[currentLanguage];
    
    const chatHeader = document.getElementById('chatHeader');
    if (chatHeader) {
        chatHeader.textContent = t.chatHeaders[chat.persona] || chat.title;
    }
    
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
        chat.messages.forEach(msg => {
            addMessageToDOM(msg.text, msg.sender);
        });
    }
}

// 渲染聊天历史
function renderChatHistory() {
    const historyContainer = document.getElementById('chatHistory');
    if (!historyContainer) return;
    
    if (chatSessions.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <div>${currentLanguage === 'zh' ? '暂无聊天记录' : 'No chat history'}</div>
            </div>
        `;
        return;
    }
    
    historyContainer.innerHTML = chatSessions.map(chat => `
        <div class="chat-history-item ${chat.id === currentChatId ? 'active' : ''}" 
             onclick="switchToChat('${chat.id}')">
            <div class="chat-title">${chat.title}</div>
            <div class="chat-preview">${chat.lastMessage}</div>
            <div class="chat-date">${formatDate(chat.createdAt)}</div>
            <button class="delete-chat-btn" onclick="deleteChatSession('${chat.id}', event)">🗑️</button>
        </div>
    `).join('');
}

// 删除聊天会话
function deleteChatSession(chatId, event) {
    event.stopPropagation();
    
    chatSessions = chatSessions.filter(chat => chat.id !== chatId);
    
    if (currentChatId === chatId) {
        if (chatSessions.length > 0) {
            switchToChat(chatSessions[0].id);
        } else {
            currentChatId = null;
            document.getElementById('chatMessages').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🤖</div>
                    <div>${currentLanguage === 'zh' ? '请创建新对话开始聊天' : 'Create a new chat to start conversation'}</div>
                </div>
            `;
        }
    }
    
    renderChatHistory();
    saveChatSessions();
}

// 格式化日期
function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return currentLanguage === 'zh' ? '刚刚' : 'Just now';
    if (minutes < 60) return currentLanguage === 'zh' ? `${minutes}分钟前` : `${minutes}m ago`;
    if (hours < 24) return currentLanguage === 'zh' ? `${hours}小时前` : `${hours}h ago`;
    if (days < 7) return currentLanguage === 'zh' ? `${days}天前` : `${days}d ago`;
    
    return date.toLocaleDateString();
}

// 保存聊天记录
function saveChatSessions() {
    console.log('聊天记录已保存:', chatSessions.length, '个会话');
}

// 加载聊天记录
function loadChatSessions() {
    chatSessions = [];
}

// 添加消息到DOM
function addMessageToDOM(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 处理键盘事件
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || !currentChatId) return;
    
    // 添加用户消息
    addMessage(message, 'user');
    input.value = '';
    
    // 模拟AI回复
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessage(aiResponse, 'ai');
    }, 1000);
}

// 添加消息到聊天界面
function addMessage(text, sender) {
    const chat = chatSessions.find(c => c.id === currentChatId);
    if (!chat) return;
    
    const message = {
        text: text,
        sender: sender,
        timestamp: new Date()
    };
    
    chat.messages.push(message);
    chat.lastMessage = text;
    
    addMessageToDOM(text, sender);
    renderChatHistory();
    saveChatSessions();
}

// 生成AI回复（简单模拟）
function generateAIResponse(userMessage) {
    const responses = {
        zh: {
            planning: [
                "好的，我建议您提前预订所有交通和住宿，并准备备用计划。需要我帮您制定详细的时间表吗？",
                "为了确保安全，建议您购买旅行保险并了解当地的紧急联系方式。还有什么具体的安全问题需要咨询吗？",
                "我可以帮您规划最优的路线，避开人流高峰期。请告诉我您的具体旅行日期。"
            ],
            social: [
                "这听起来很棒！我推荐一些适合拍照的网红景点和最佳拍摄时间。您希望拍什么风格的照片？",
                "为了创造美好回忆，建议您安排一些团体活动，比如当地美食体验或音乐会。需要具体推荐吗？",
                "我可以推荐一些适合和朋友一起体验的活动，让您的旅行更加难忘！"
            ],
            cultural: [
                "太好了！我建议您参加当地的文化工作坊或传统节庆活动。您对哪个国家的文化最感兴趣？",
                "为了深度体验，推荐您选择民宿而非酒店，这样能更好地感受当地生活方式。",
                "我可以为您推荐一些隐藏的文化宝地，让您获得独特的心灵体验。"
            ]
        },
        en: {
            planning: [
                "Great! I suggest booking all transportation and accommodation in advance and preparing backup plans. Would you like me to help create a detailed schedule?",
                "For safety, I recommend purchasing travel insurance and knowing local emergency contacts. Any specific safety concerns?",
                "I can help plan the optimal route avoiding peak hours. Please tell me your specific travel dates."
            ],
            social: [
                "That sounds wonderful! I recommend some Instagram-worthy spots and best photography times. What style of photos are you hoping to take?",
                "To create beautiful memories, consider group activities like local food experiences or concerts. Need specific recommendations?",
                "I can suggest activities perfect for experiencing with friends to make your trip unforgettable!"
            ],
            cultural: [
                "Excellent! I suggest joining local cultural workshops or traditional festivals. Which country's culture interests you most?",
                "For deep cultural immersion, I recommend choosing homestays over hotels to better experience local lifestyle.",
                "I can recommend hidden cultural gems for unique spiritual experiences."
            ]
        }
    };
    
    const personaResponses = responses[currentLanguage][selectedPersona];
    return personaResponses[Math.floor(Math.random() * personaResponses.length)];
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);