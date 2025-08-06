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
            social: "你好！我是你的欧洲旅行关系助手。我会帮你创造美好回忆和拍摄完美照片。请告诉我你和谁一起旅行，计划去欧洲哪些国家或城市？",
            cultural: "你好！我是你的欧洲旅行体验助手。我会帮你发现独特的当地文化体验。请告诉我你计划去欧洲哪些国家或城市？"
        },
        inputPlaceholder: "输入你的问题...",
        sendBtn: "发送",
        chatHistoryTitle: "聊天记录",
        newChatBtn: "新对话",
        emptyChatTip: "请创建新对话开始聊天",
        exitBtn: "退出"
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
        newChatBtn: "New Chat",
        emptyChatTip: "Create a new chat to start conversation",
        exitBtn: "Exit"
    }
};

// ✅ 放这里：在 init() 之前插入你的函数
function loadChatSessions() {
    try {
        const saved = localStorage.getItem('travel_chat_sessions');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.version === '2.0' && Array.isArray(data.sessions)) {
                chatSessions = data.sessions;
                currentChatId = data.currentChatId;
                selectedPersona = data.selectedPersona;
                
                chatSessions.forEach(chat => {
                    if (!chat.travelInfo) {
                        chat.travelInfo = {
                            destination: null,
                            duration: null,
                            budget: null,
                            persona: chat.persona
                        };
                    }
                    if (!chat.backendSessionId) {
                        chat.backendSessionId = null;
                    }
                });
                
                console.log('📂 聊天记录已加载:', chatSessions.length, '个会话');
            } else {
                localStorage.removeItem('travel_chat_sessions');
                console.log('🧹 清理旧版本数据');
            }
        }
    } catch (error) {
        console.error('❌ 加载聊天记录失败:', error);
        chatSessions = [];
    }
}

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
https://github.com/Sylvan-Wang/Travel-Planning-Assistant/tree/main
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
        'newChatBtn': t.newChatBtn,
        'exitBtn': t.exitBtn
    };

    Object.entries(elements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    });

    // 更新语言按钮
    const langLabel = currentLanguage === 'zh' ? 'EN' : '中';
    ['langBtn', 'langBtn2', 'langBtn3'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.textContent = langLabel;
    });

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

// 🔓 显式暴露函数到全局作用域
window.toggleLanguage = toggleLanguage;
window.showPersonaSelection = showPersonaSelection;
window.confirmPersona = confirmPersona;
window.selectPersona = selectPersona;
window.returnToWelcome = returnToWelcome;

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
// 🔧 2. 修改 createNewChat 函数 - 添加 backendSessionId 字段
function createNewChat() {
    const chatId = 'chat_' + Date.now();
    const t = texts[currentLanguage];
    
    const newChat = {
        id: chatId, // 前端对话ID
        backendSessionId: null, // 🔑 关键：后端session_id，首次为null
        persona: selectedPersona,
        title: t.chatHeaders[selectedPersona] || 'New Chat',
        messages: [{
            text: t.welcomeMessages[selectedPersona] || 'Hello! How can I help you?',
            sender: 'ai',
            timestamp: new Date()
        }],
        createdAt: new Date(),
        lastMessage: t.welcomeMessages[selectedPersona] || 'Hello! How can I help you?',
        travelInfo: { // 🔑 旅行信息状态跟踪
            destination: null,
            duration: null,
            budget: null,
            persona: selectedPersona
        }
    };
    
    chatSessions.unshift(newChat);
    currentChatId = chatId;
    
    updateChatInterface();
    renderChatHistory();
    saveChatSessions();
    
    console.log(`🆕 创建新对话: ${chatId}, persona: ${selectedPersona}`);
}

// 切换聊天会话
function switchToChat(chatId) {
    console.log(`🔄 切换到对话: ${chatId}`);
    
    const chat = chatSessions.find(c => c.id === chatId);
    if (!chat) {
        console.error(`❌ 找不到对话: ${chatId}`);
        return;
    }
    
    currentChatId = chatId;
    selectedPersona = chat.persona;
    
    console.log(`📋 对话信息:`);
    console.log(`   - 前端ID: ${chat.id}`);
    console.log(`   - 后端Session: ${chat.backendSessionId || 'null'}`);
    console.log(`   - Persona: ${chat.persona}`);
    console.log(`   - 消息数: ${chat.messages.length}`);
    console.log(`   - 旅行信息:`, chat.travelInfo);
    
    updateChatInterface();
    renderChatHistory();
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

    // ✅ 保证语言按钮等组件也更新
    updateTexts();
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
                    <div class="empty-state-icon">( •̀ ω •́ )✧</div>
                    <div>${texts[currentLanguage].emptyChatTip}</div>
                </div>
            `;
        }
    }
    
    renderChatHistory();
    saveChatSessions();
}

// 格式化日期（处理所有异常情况）
function formatDate(dateInput) {
    console.log("🧪 调试 formatDate 输入:", dateInput, "| 类型:", typeof dateInput);

    try {
        const parsedDate = new Date(dateInput);

        // 如果转换失败（如传入的是 undefined、{}、空字符串等）
        if (isNaN(parsedDate.getTime())) {
            console.warn("⚠️ 无效日期，返回占位");
            return currentLanguage === 'zh' ? '未知时间' : 'Unknown';
        }

        const now = new Date();
        const diff = now - parsedDate;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return currentLanguage === 'zh' ? '刚刚' : 'Just now';
        if (minutes < 60) return currentLanguage === 'zh' ? `${minutes}分钟前` : `${minutes}m ago`;
        if (hours < 24) return currentLanguage === 'zh' ? `${hours}小时前` : `${hours}h ago`;
        if (days < 7) return currentLanguage === 'zh' ? `${days}天前` : `${days}d ago`;

        return parsedDate.toLocaleDateString(); // ✅ 格式化输出
    } catch (error) {
        console.error("❌ formatDate 彻底失败:", error, "原始输入：", dateInput);
        return currentLanguage === 'zh' ? '未知时间' : 'Unknown';
    }
}

// 🔧 7. 修改保存函数 - 包含 backendSessionId
function saveChatSessions() {
    try {
        const dataToSave = {
            sessions: chatSessions,
            currentChatId: currentChatId,
            selectedPersona: selectedPersona,
            version: '2.0' // 版本标记
        };
        localStorage.setItem('travel_chat_sessions', JSON.stringify(dataToSave));
        console.log('💾 聊天记录已保存:', chatSessions.length, '个会话');
    } catch (error) {
        console.error('❌ 保存聊天记录失败:', error);
    }
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
/*发送消息*/
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const message = input.value.trim();

    if (!message || !currentChatId) return;

    // 🔑 获取当前对话
    const currentChat = chatSessions.find(c => c.id === currentChatId);
    if (!currentChat) {
        console.error('❌ 找不到当前对话');
        return;
    }
    // persona_key映射表
    const personaKeyMap = {
        planning: 'planner',
        social: 'social',
        cultural: 'experiential'
    };
    
    // 锁定UI
    sendBtn.disabled = true;
    input.disabled = true;
    sendBtn.textContent = currentLanguage === 'zh' ? "思考中..." : "Thinking...";

    // 添加用户消息到界面
    addMessage(message, 'user');
    input.value = '';

    // 添加AI占位消息
    addMessage("旅游助手 正在努力思考中💦...", 'ai');

    try {
        console.log(`📤 发送消息到对话 ${currentChatId}`);
        console.log(`📋 当前后端session: ${currentChat.backendSessionId || 'null(首次)'}`);
        // 🔄 persona 映射
        
        // 🔑 构建请求数据 - 关键修复
        const requestData = {
            message: message,
            session_id: currentChat.backendSessionId, // 🔑 传递后端session_id
            persona_key: personaKeyMap[currentChat.persona], // ✅ 使用映射值
            history: currentChat.messages
                .filter(m => !m.text.includes('思考中')) // 过滤占位消息
                .map(m => [m.text, m.sender]) // 转换格式
        };

        console.log('📤 发送请求数据:', {
            message: message.substring(0, 20) + '...',
            session_id: requestData.session_id,
            persona_key: requestData.persona_key,
            history_length: requestData.history.length
        });

        const response = await fetch("https://eliot0110-travel-assistant.hf.space/api/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        console.log('📥 收到响应:', {
            session_id: data.session_id,
            reply_length: data.reply?.length || 0,
            status_info: data.status_info ? Object.keys(data.status_info) : []
        });
        
        // 🔑 保存后端返回的session_id - 关键步骤！
        if (data.session_id) {
            if (currentChat.backendSessionId !== data.session_id) {
                console.log(`💾 更新后端session: ${currentChat.backendSessionId} → ${data.session_id}`);
                currentChat.backendSessionId = data.session_id;
            }
        }

        // 🔑 更新旅行信息状态
        if (data.status_info) {
            updateTravelInfo(currentChat, data.status_info);
        }

        // 替换AI回复
        const aiReply = data.reply || "抱歉，旅游助手已经努力过了🥹";
        replaceLastAIMessage(aiReply);

        // 智能更新对话标题
        updateChatTitle(currentChat);

        console.log('✅ 消息发送成功');

    } catch (error) {
        console.error("❌ API请求错误：", error);
        replaceLastAIMessage("❌ 请求失败，请检查网络连接或稍后再问旅游助手😵");
    } finally {
        // 解锁UI
        sendBtn.disabled = false;
        input.disabled = false;
        sendBtn.textContent = texts[currentLanguage].sendBtn;
        input.focus();
    }
}

// 🔧 4. 新增：更新旅行信息状态
function updateTravelInfo(chat, statusInfo) {
    console.log('📊 更新旅行信息:', statusInfo);
    
    // 更新目的地
    if (statusInfo.destination && statusInfo.destination.status === 'completed') {
        chat.travelInfo.destination = statusInfo.destination.name;
        console.log(`🏙️ 目的地已设置: ${statusInfo.destination.name}`);
    }
    
    // 更新天数
    if (statusInfo.duration && statusInfo.duration.status === 'completed') {
        chat.travelInfo.duration = statusInfo.duration.days;
        console.log(`⏰ 天数已设置: ${statusInfo.duration.days}天`);
    }
    
    // 更新预算
    if (statusInfo.budget && statusInfo.budget.status === 'completed') {
        chat.travelInfo.budget = statusInfo.budget.description;
        console.log(`💰 预算已设置: ${statusInfo.budget.description}`);
    }
    
    // 计算完成进度
    const completedItems = [
        chat.travelInfo.destination,
        chat.travelInfo.duration, 
        chat.travelInfo.budget
    ].filter(item => item !== null).length;
    
    console.log(`📈 信息收集进度: ${completedItems}/3`);
}

// 🔧 5. 新增：智能更新对话标题
function updateChatTitle(chat) {
    const info = chat.travelInfo;
    const t = texts[currentLanguage];
    
    if (info.destination && info.duration) {
        chat.title = `${info.destination} ${info.duration}天`;
    } else if (info.destination) {
        chat.title = `${info.destination}旅行`;
    } else {
        // 保持原有的persona标题
        chat.title = t.chatHeaders[chat.persona] || 'New Chat';
    }
    
    console.log(`🏷️ 更新对话标题: ${chat.title}`);
}


// 退出并返回欢迎页面
function returnToWelcome() {
    // 清除所有 active 页面
    document.getElementById('chatPage').classList.remove('active');
    document.getElementById('personaPage').classList.remove('active');
    document.getElementById('welcomePage').classList.add('active');
    currentPage = 'welcome';

    // 清空聊天输入与内容
    document.getElementById('messageInput').value = '';
    document.getElementById('chatMessages').innerHTML = '';
    document.getElementById('chatHistory').innerHTML = '';

    // 重置状态
    selectedPersona = null;
    currentChatId = null;
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

function replaceLastAIMessage(newText) {
    const chat = chatSessions.find(c => c.id === currentChatId);
    if (!chat || chat.messages.length === 0) return;

    for (let i = chat.messages.length - 1; i >= 0; i--) {
        if (chat.messages[i].sender === 'ai') {
            chat.messages[i].text = newText;
            break;
        }
    }

    updateChatInterface();
    renderChatHistory();
    saveChatSessions();
}
// 🎯 9. 测试函数 - 验证session管理
function testSessionManagement() {
    console.log("🧪 === 测试Session管理 ===");
    
    // 显示当前状态
    console.log("📊 当前状态:");
    console.log(`   - currentChatId: ${currentChatId}`);
    console.log(`   - chatSessions数量: ${chatSessions.length}`);
    
    if (currentChatId) {
        const currentChat = chatSessions.find(c => c.id === currentChatId);
        if (currentChat) {
            console.log(`   - 当前对话后端session: ${currentChat.backendSessionId}`);
            console.log(`   - 旅行信息:`, currentChat.travelInfo);
        }
    }
    
    console.log("🧪 === 测试完成 ===");
}
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 🎯 10. 立即执行修复
console.log("🔧 Session管理修复已加载！");
console.log("📝 使用 testSessionManagement() 检查状态");
console.log("💡 现在发送消息应该能正确累积信息了！");




// 语音输入功能

let isRecording = false;
let mediaRecorder;
let audioChunks = [];

// 主函数，麦克风触发
function startVoiceInput() {
    if (isRecording) return;

    isRecording = true;
    showListeningOverlay();

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            audioChunks = [];
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                sendAudioToServer(audioBlob);
                hideListeningOverlay();
                isRecording = false;
            };

            // 自动 60 秒后结束
            setTimeout(() => {
                mediaRecorder.stop();
            }, 60000);
        })
        .catch(err => {
            alert("无法访问麦克风：" + err.message);
            hideListeningOverlay();
            isRecording = false;
        });
}


function showListeningOverlay() {
    const overlay = document.getElementById("listeningOverlay");
    overlay.classList.remove("hidden");
}

function hideListeningOverlay() {
    const overlay = document.getElementById("listeningOverlay");
    overlay.classList.add("hidden");
}


// 发送语音到后端 + 回填输入框

function sendAudioToServer(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    // 这里要替换地址要替换地址要替换接口地址
    fetch("("https://eliot0110-travel-assistant.hf.space/api/whisper/transcribe", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const transcript = data.transcript;
        document.getElementById("messageInput").value = transcript;
    })
    .catch(err => {
        console.error("⚠️⚠️error：", err);
        alert("😵Please Try Again！");
    });
}

function stopRecordingFromOverlay() {
    if (isRecording && mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
    hideListeningOverlay();
    isRecording = false;
}













