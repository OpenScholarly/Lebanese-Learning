// Enhanced Lebanese Arabic Learning Platform - Complete Implementation
let appData = {
  vocabularyCategories: {},
  radioStations: [],
  podcasts: [],
  tvShows: [],
  culture: {},
  newsChannels: [],
  grammarTopics: []
};

// Enhanced Application State
let currentUser = {
  xp: 450,
  level: 2,
  currentCard: 0,
  selectedCategory: 'greetings_basic',
  wordsLearned: 65,
  masteredWords: 65,
  difficultWords: 15,
  totalWords: 130,
  dailyGoal: 30,
  streakDays: 12,
  studyTime: 28,
  proficiency: 'intermediate',
  audioEnabled: true,
  slowAudioEnabled: true,
  autoPlayEnabled: false,
  dailyReminders: true,
  streakReminders: true,
  achievementNotifications: true,
  savedTranslations: [],
  translationHistory: [],
  achievements: ['first_week', 'word_master'],
  learningMode: 'flashcard',
  currentGrammarTopic: null
};

let currentVocabulary = [];
let filteredVocabulary = [];
let allVocabulary = [];
let progressChart = null;
let speechSynthesis = window.speechSynthesis;
let availableVoices = [];
let selectedVoice = null;
let currentAudio = null;

// Initialize Enhanced App
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Enhanced Lebanese Arabic Platform initializing...');
  await loadEnhancedData();
  initializeEnhancedApp();
  setupEnhancedEventListeners();
  loadEnhancedVocabulary();
  loadRadioStations();
  loadPodcasts();
  loadTVShows();
  loadCultureContent();
  loadGrammarTopics();
  loadNewsChannels();
  updateEnhancedUI();
  initializeVoices();
  setupProgressChart();
  loadTranslationHistory();
});

// Load Enhanced Real Data from local files
async function loadEnhancedData() {
  try {
    console.log('📊 Loading enhanced data from local assets...');
    
    // Load expanded vocabulary
    const vocabResponse = await fetch('./expanded_vocabulary.json');
    if (vocabResponse.ok) {
      const vocabData = await vocabResponse.json();
      // The JSON file contains the categories directly, not wrapped
      appData.vocabularyCategories = vocabData;
    }
    
    // Load radio stations
    const radioResponse = await fetch('./lebanese_radio_stations.json');
    if (radioResponse.ok) {
      const radioData = await radioResponse.json();
      // The JSON file contains the array directly
      appData.radioStations = radioData;
    }
    
    // Load podcasts
    const podcastResponse = await fetch('./lebanese_podcasts.json');
    if (podcastResponse.ok) {
      const podcastData = await podcastResponse.json();
      // The JSON file contains the array directly
      appData.podcasts = podcastData;
    }
    
    // Load TV shows
    const tvResponse = await fetch('./lebanese_tv_shows.json');
    if (tvResponse.ok) {
      const tvData = await tvResponse.json();
      // The JSON file contains the array directly
      appData.tvShows = tvData;
    }
    
    // Load culture content
    const cultureResponse = await fetch('./lebanese_culture.json');
    if (cultureResponse.ok) {
      const cultureData = await cultureResponse.json();
      // The JSON file contains the culture object directly
      appData.culture = cultureData;
    }
    
    // Load grammar content
    const grammarResponse = await fetch('./grammar_content.json');
    if (grammarResponse.ok) {
      const grammarData = await grammarResponse.json();
      // Transform the grammar data into the expected format
      appData.grammarTopics = [
        {id: 'pronouns', title: 'Personal Pronouns', description: 'Learn Lebanese Arabic personal pronouns', data: grammarData.personal_pronouns},
        {id: 'verbs', title: 'Verb Conjugations', description: 'Master verb conjugations', data: grammarData.verb_conjugations || []},
        {id: 'demonstratives', title: 'This/That/These', description: 'Demonstrative pronouns', data: grammarData.demonstratives || []},
        {id: 'questions', title: 'Question Formation', description: 'How to ask questions', data: grammarData.question_words || []}
      ];
    }
    
    // Load expanded news channels
    const newsResponse = await fetch('./expanded_news_channels.json');
    if (newsResponse.ok) {
      const newsData = await newsResponse.json();
      // The JSON file contains the array directly
      appData.newsChannels = newsData;
    }
    
    // Create comprehensive vocabulary array
    if (Object.keys(appData.vocabularyCategories).length > 0) {
      allVocabulary = Object.entries(appData.vocabularyCategories).flatMap(([categoryKey, cat]) =>
        cat.words.map(word => ({...word, category: cat.name, categoryKey}))
      );
      currentUser.totalWords = allVocabulary.length;
    }
    
    console.log('✅ Enhanced data loaded successfully:', {
      vocabulary: allVocabulary.length,
      categories: Object.keys(appData.vocabularyCategories).length,
      radioStations: appData.radioStations.length,
      podcasts: appData.podcasts.length,
      tvShows: appData.tvShows.length,
      grammarTopics: appData.grammarTopics.length,
      newsChannels: appData.newsChannels.length
    });
    
    // If no data loaded, use fallback
    if (allVocabulary.length === 0) {
      // Build a detailed error message
      let failedSources = [];
      if (!appData.vocabularyCategories || Object.keys(appData.vocabularyCategories).length === 0) {
        failedSources.push('vocabularyCategories (./expanded_vocabulary.json)');
      }
      // You can add more checks for other sources if needed
      let errorMsg = 'No vocabulary data loaded. ';
      if (failedSources.length > 0) {
        errorMsg += 'The following data sources failed to load or were empty: ' + failedSources.join(', ') + '. ';
      }
      errorMsg += 'Please check that the required JSON files exist, are accessible, and contain valid data.';
      throw new Error(errorMsg);
    }
    
  } catch (error) {
    console.error('❌ Error loading enhanced data:', error);
    loadFallbackEnhancedData();
  }
}

function loadFallbackEnhancedData() {
  console.log('📋 Loading fallback enhanced data...');
  
  // Comprehensive fallback data structure
  appData.vocabularyCategories = {
    greetings_basic: {
      name: "Greetings & Basic Phrases",
      name_arabic: "التحيات والعبارات الأساسية",
      icon: "👋",
      words: [
        {arabic: "أهلاً وسهلاً", pronunciation: "ahlan wa sahlan", english: "hello/welcome", french: "bonjour/bienvenue", usage: "formal_greeting"},
        {arabic: "مرحبا", pronunciation: "marhaba", english: "hello", french: "bonjour", usage: "casual_greeting"},
        {arabic: "صباح الخير", pronunciation: "sabah el kheir", english: "good morning", french: "bonjour", usage: "morning_greeting"},
        {arabic: "مساء الخير", pronunciation: "masa el kheir", english: "good evening", french: "bonsoir", usage: "evening_greeting"},
        {arabic: "تصبح على خير", pronunciation: "tisbah 3ala kheir", english: "good night", french: "bonne nuit", usage: "night_farewell"},
        {arabic: "شكراً", pronunciation: "shukran", english: "thank you", french: "merci", usage: "gratitude"},
        {arabic: "عفواً", pronunciation: "3afwan", english: "you're welcome", french: "de rien", usage: "response_to_thanks"},
        {arabic: "كيفك؟", pronunciation: "kifak?", english: "how are you? (m)", french: "comment allez-vous?", usage: "inquiry_male"},
        {arabic: "كيفِك؟", pronunciation: "kifik?", english: "how are you? (f)", french: "comment allez-vous?", usage: "inquiry_female"},
        {arabic: "منيح", pronunciation: "mnih", english: "good/fine", french: "bien", usage: "status_response"}
      ]
    },
    lebanese_slang: {
      name: "Lebanese Slang & Expressions",
      name_arabic: "العامية والتعابير اللبنانية",
      icon: "💬",
      words: [
        {arabic: "يلا", pronunciation: "yalla", english: "let's go/come on", french: "allons-y", usage: "encouragement"},
        {arabic: "خلص", pronunciation: "khalas", english: "finished/enough", french: "fini/assez", usage: "completion"},
        {arabic: "شو؟", pronunciation: "shu?", english: "what?", french: "quoi?", usage: "question"},
        {arabic: "وين؟", pronunciation: "wayn?", english: "where?", french: "où?", usage: "location_inquiry"},
        {arabic: "بدي", pronunciation: "biddi", english: "I want", french: "je veux", usage: "desire"},
        {arabic: "مخيف", pronunciation: "mukheef", english: "scary (but means awesome!)", french: "effrayant (mais génial!)", usage: "slang_awesome"}
      ]
    },
    emotions_feelings: {
      name: "Emotions & Feelings",
      name_arabic: "المشاعر والأحاسيس",
      icon: "😊",
      words: [
        {arabic: "تعبان", pronunciation: "ta3ban", english: "tired", french: "fatigué", usage: "physical_state"},
        {arabic: "مبسوط", pronunciation: "mabsout", english: "happy", french: "heureux", usage: "positive_emotion"},
        {arabic: "زعلان", pronunciation: "za3lan", english: "upset/angry", french: "fâché", usage: "negative_emotion"},
        {arabic: "خايف", pronunciation: "khayef", english: "scared", french: "effrayé", usage: "fear"},
        {arabic: "فرحان", pronunciation: "farhan", english: "joyful", french: "joyeux", usage: "joy"}
      ]
    }
  };
  
  appData.radioStations = [
    {name: "Radio Delta Lebanon", name_arabic: "راديو دلتا لبنان", frequency: "Various FM", genre: "Arabic Pop, Lebanese Music", description: "Top Arabic radio station"},
    {name: "Virgin Radio Lebanon", name_arabic: "فيرجين راديو لبنان", frequency: "89.5 FM", genre: "Pop, Rock, International", description: "International music station"}
  ];
  
  appData.podcasts = [
    {name: "Learn Levantine Arabic with Livi", host: "Olivia Furber", rating: 4.9, level: "Intermediate", description: "Native speaker interviews"},
    {name: "Real Arabic", rating: 4.7, level: "Beginner", description: "Culture and politics with transcripts"}
  ];
  
  appData.tvShows = [
    {title: "Ya Rayt", title_arabic: "يا ريت", type: "Drama", description: "Lebanese drama perfect for learning", subtitles: ["Arabic", "English"]},
    {title: "Al Hayba", title_arabic: "الهيبة", type: "Action", description: "Popular action series", seasons: 3}
  ];
  
  appData.culture = {
    traditions: [
      {name: "Dabke Dance", name_arabic: "دبكة", description: "Traditional folk dance performed in lines"},
      {name: "Lebanese Hospitality", name_arabic: "الضيافة اللبنانية", description: "Sacred tradition of welcoming guests"}
    ],
    figures: [
      {name: "Fairuz", name_arabic: "فيروز", title: "Ambassador to the Stars", birth_year: 1935}
    ]
  };
  
  appData.grammarTopics = [
    {id: "pronouns", title: "Personal Pronouns", description: "Learn Lebanese Arabic personal pronouns"},
    {id: "verbs", title: "Verb Conjugations", description: "Master verb conjugations"}
  ];
  
  appData.newsChannels = [
    {name: "MTV Lebanon", name_arabic: "قناة أم تي في", description: "Leading entertainment and news"},
    {name: "Al Jadeed", name_arabic: "قناة الجديد", description: "Independent news channel"}
  ];
  
  // Create comprehensive vocabulary
  allVocabulary = Object.values(appData.vocabularyCategories).flatMap(cat => 
    cat.words.map(word => ({...word, category: cat.name, categoryKey: Object.keys(appData.vocabularyCategories).find(k => appData.vocabularyCategories[k] === cat)}))
  );
  
  currentUser.totalWords = allVocabulary.length;
}

function initializeEnhancedApp() {
  console.log('🎯 Initializing enhanced app features...');
  
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeToggle = document.getElementById('themeToggle');
  if (isDarkMode && themeToggle) {
    document.documentElement.setAttribute('data-color-scheme', 'dark');
    themeToggle.textContent = '☀️ Light Mode';
  }
  
  showSection('dashboard');
  loadDashboardContent();
  setupGlobalSearch();
}

function setupEnhancedEventListeners() {
  console.log('🔧 Setting up enhanced event listeners...');
  
  setTimeout(() => {
    // Enhanced Navigation
    setupEnhancedNavigation();
    
    // Enhanced Vocabulary Controls
    setupEnhancedVocabularyControls();
    
    // Grammar Controls
    setupGrammarControls();
    
    // Radio Controls
    setupRadioControls();
    
    // Podcast Controls
    setupPodcastControls();
    
    // TV Show Controls
    setupTVShowControls();
    
    // Culture Controls
    setupCultureControls();
    
    // Enhanced Translation Controls
    setupEnhancedTranslationControls();
    
    // Enhanced Profile Controls
    setupEnhancedProfileControls();
    
    // Global Search
    setupGlobalSearchHandlers();
    
  }, 100);
}

function setupEnhancedNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const closeSidebar = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');
  const themeToggle = document.getElementById('themeToggle');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      sidebar.classList.add('open');
    });
  }

  if (closeSidebar && sidebar) {
    closeSidebar.addEventListener('click', (e) => {
      e.preventDefault();
      sidebar.classList.remove('open');
    });
  }
  
  document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        !menuToggle?.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  }

  // Enhanced navigation links with data attributes
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const section = link.getAttribute('data-section');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.currentTarget.getAttribute('data-category');
      showSection(section, category);
      if (sidebar) sidebar.classList.remove('open');
    });
  });

  // Quick action buttons
  const actionButtons = document.querySelectorAll('[data-section]:not(.nav-link)');
  actionButtons.forEach(btn => {
    const section = btn.getAttribute('data-section');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.currentTarget.getAttribute('data-category');
      showSection(section, category);
    });
  });
}

function setupGlobalSearch() {
  const globalSearch = document.getElementById('globalSearch');
  const searchBtn = document.getElementById('searchBtn');
  
  if (globalSearch) {
    globalSearch.addEventListener('input', debounce((e) => {
      performGlobalSearch(e.target.value);
    }, 300));
    
    globalSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performGlobalSearch(e.target.value);
      }
    });
  }
  
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (globalSearch) {
        performGlobalSearch(globalSearch.value);
      }
    });
  }
}

function setupGlobalSearchHandlers() {
  // Already handled in setupGlobalSearch
}

function performGlobalSearch(query) {
  if (!query.trim()) return;
  
  console.log('🔍 Global search:', query);
  
  // Search vocabulary
  const vocabResults = allVocabulary.filter(word => 
    word.english.toLowerCase().includes(query.toLowerCase()) ||
    word.french.toLowerCase().includes(query.toLowerCase()) ||
    word.arabic.includes(query) ||
    word.pronunciation.toLowerCase().includes(query.toLowerCase())
  );
  
  if (vocabResults.length > 0) {
    showSection('vocabulary');
    filteredVocabulary = vocabResults;
    currentVocabulary = filteredVocabulary;
    currentUser.currentCard = 0;
    updateFlashcard();
    showNotification(`Found ${vocabResults.length} vocabulary matches`);
  } else {
    showNotification('No matches found');
  }
}

function showSection(sectionName, categoryData = null) {
  console.log('📄 Showing section:', sectionName, categoryData);
  
  // Update navigation active state
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkSection = link.getAttribute('data-section');
    if (linkSection === sectionName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Show/hide sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    if (section.id === sectionName) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });
  
  // Load section-specific content
  switch(sectionName) {
    case 'vocabulary':
      loadCategoryOverview();
      if (categoryData) {
        selectCategory(categoryData);
      }
      break;
    case 'grammar':
      loadGrammarTopics();
      break;
    case 'radio':
      loadRadioStations();
      break;
    case 'podcasts':
      loadPodcasts();
      break;
    case 'tvshows':
      loadTVShows();
      break;
    case 'culture':
      loadCultureContent();
      break;
    case 'news':
      loadNewsChannels();
      break;
    case 'translate':
      loadEnhancedTranslation();
      break;
    case 'profile':
      updateEnhancedProfile();
      break;
  }
}

function toggleTheme() {
  const currentScheme = document.documentElement.getAttribute('data-color-scheme');
  const newScheme = currentScheme === 'dark' ? 'light' : 'dark';
  const themeToggle = document.getElementById('themeToggle');
  
  document.documentElement.setAttribute('data-color-scheme', newScheme);
  if (themeToggle) {
    themeToggle.textContent = newScheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
  showNotification(`Switched to ${newScheme} mode`);
}

function loadDashboardContent() {
  // Update dashboard stats
  const totalVocabWords = document.getElementById('totalVocabWords');
  if (totalVocabWords) {
    totalVocabWords.textContent = `${currentUser.totalWords}+`;
  }
  
  const streakDays = document.getElementById('streakDays');
  if (streakDays) {
    streakDays.textContent = currentUser.streakDays;
  }
}

// Enhanced Vocabulary Functions
function setupEnhancedVocabularyControls() {
  const flipCard = document.getElementById('flipCard');
  const prevCard = document.getElementById('prevCard');
  const nextCard = document.getElementById('nextCard');
  const playAudio = document.getElementById('playAudio');
  const slowAudio = document.getElementById('slowAudio');
  const flashcard = document.getElementById('flashcard');
  const markEasy = document.getElementById('markEasy');
  const markMedium = document.getElementById('markMedium');
  const markHard = document.getElementById('markHard');
  const learningMode = document.getElementById('learningMode');
  const vocabularySearch = document.getElementById('vocabularySearch');
  const difficultyFilter = document.getElementById('difficultyFilter');

  if (flipCard && flashcard) {
    flipCard.addEventListener('click', (e) => {
      e.preventDefault();
      flashcard.classList.toggle('flipped');
    });

    flashcard.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        flashcard.classList.toggle('flipped');
      }
    });
  }

  if (prevCard) {
    prevCard.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser.currentCard > 0) {
        currentUser.currentCard--;
        updateFlashcard();
      }
    });
  }

  if (nextCard) {
    nextCard.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser.currentCard < currentVocabulary.length - 1) {
        currentUser.currentCard++;
        updateFlashcard();
        awardXP(5);
      }
    });
  }

  if (playAudio) {
    playAudio.addEventListener('click', (e) => {
      e.preventDefault();
      const word = currentVocabulary[currentUser.currentCard];
      if (word) {
        speakArabicText(word.arabic, 1.0);
      }
    });
  }

  if (slowAudio) {
    slowAudio.addEventListener('click', (e) => {
      e.preventDefault();
      const word = currentVocabulary[currentUser.currentCard];
      if (word) {
        speakArabicText(word.arabic, 0.6);
      }
    });
  }

  if (markEasy) {
    markEasy.addEventListener('click', (e) => {
      e.preventDefault();
      handleMasteryFeedback('easy');
    });
  }

  if (markMedium) {
    markMedium.addEventListener('click', (e) => {
      e.preventDefault();
      handleMasteryFeedback('medium');
    });
  }

  if (markHard) {
    markHard.addEventListener('click', (e) => {
      e.preventDefault();
      handleMasteryFeedback('hard');
    });
  }

  if (learningMode) {
    learningMode.addEventListener('change', (e) => {
      currentUser.learningMode = e.target.value;
      updateLearningMode();
    });
  }

  if (vocabularySearch) {
    vocabularySearch.addEventListener('input', debounce((e) => {
      filterVocabulary();
    }, 300));
  }

  if (difficultyFilter) {
    difficultyFilter.addEventListener('change', () => {
      filterVocabulary();
    });
  }
}

function loadEnhancedVocabulary() {
  loadCategoryOverview();
  selectCategory('all');
}

function loadCategoryOverview() {
  const categoryOverview = document.getElementById('categoryOverview');
  if (!categoryOverview) return;
  
  categoryOverview.innerHTML = '';
  
  Object.entries(appData.vocabularyCategories).forEach(([key, category]) => {
    const categoryCard = document.createElement('div');
    categoryCard.className = 'category-card';
    categoryCard.setAttribute('data-category', key);
    
    const mastered = Math.floor(category.words.length * 0.7); // Simulate mastery
    
    categoryCard.innerHTML = `
      <div class="category-header">
        <div class="category-icon">${category.icon || '📚'}</div>
        <div>
          <div class="category-title">${category.name}</div>
          <div class="category-subtitle arabic">${category.name_arabic}</div>
        </div>
      </div>
      <div class="category-stats">
        <div class="word-count">${category.words.length} words</div>
        <div class="mastery-indicator">
          <span>✅ ${mastered}/${category.words.length}</span>
        </div>
      </div>
    `;
    
    categoryCard.addEventListener('click', () => {
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      categoryCard.classList.add('active');
      selectCategory(key);
    });
    
    categoryOverview.appendChild(categoryCard);
  });
  
  // Load category selector
  loadCategorySelector();
}

function loadCategorySelector() {
  const categorySelector = document.getElementById('categorySelector');
  if (!categorySelector) return;
  
  categorySelector.innerHTML = '';
  
  // Add "All" tab
  const allTab = document.createElement('button');
  allTab.className = 'category-tab active';
  allTab.setAttribute('data-category', 'all');
  allTab.textContent = 'All Categories';
  allTab.addEventListener('click', (e) => {
    e.preventDefault();
    selectCategory('all');
    updateActiveTab(allTab);
  });
  categorySelector.appendChild(allTab);

  // Add category tabs
  Object.entries(appData.vocabularyCategories).forEach(([key, category]) => {
    const tab = document.createElement('button');
    tab.className = 'category-tab';
    tab.setAttribute('data-category', key);
    tab.textContent = category.name.split(' ')[0]; // Shortened name
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      selectCategory(key);
      updateActiveTab(tab);
    });
    categorySelector.appendChild(tab);
  });
}

function updateActiveTab(activeTab) {
  document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
  activeTab.classList.add('active');
}

function selectCategory(categoryKey) {
  console.log('📂 Selecting category:', categoryKey);
  currentUser.selectedCategory = categoryKey;
  currentUser.currentCard = 0;
  
  if (categoryKey === 'all') {
    currentVocabulary = [...allVocabulary];
  } else {
    const category = appData.vocabularyCategories[categoryKey];
    currentVocabulary = category ? category.words.map(word => ({
      ...word, 
      category: category.name, 
      categoryKey: categoryKey
    })) : [];
  }
  
  filteredVocabulary = [...currentVocabulary];
  updateFlashcard();
  filterVocabulary();
}

function filterVocabulary() {
  const searchTerm = document.getElementById('vocabularySearch')?.value.toLowerCase() || '';
  const difficultyLevel = document.getElementById('difficultyFilter')?.value || 'all';
  
  filteredVocabulary = currentVocabulary.filter(word => {
    const matchesSearch = !searchTerm || 
      word.english.toLowerCase().includes(searchTerm) ||
      word.french.toLowerCase().includes(searchTerm) ||
      word.arabic.includes(searchTerm) ||
      word.pronunciation.toLowerCase().includes(searchTerm);
    
    const matchesDifficulty = difficultyLevel === 'all' || 
      getDifficultyLevel(word) === difficultyLevel;
    
    return matchesSearch && matchesDifficulty;
  });
  
  if (filteredVocabulary.length > 0) {
    currentUser.currentCard = Math.min(currentUser.currentCard, filteredVocabulary.length - 1);
    updateFlashcard();
  }
}

function getDifficultyLevel(word) {
  // Simple difficulty classification based on word length and common usage
  if (word.usage && word.usage.includes('basic')) return 'beginner';
  if (word.english.length <= 10) return 'beginner';
  if (word.english.length <= 20) return 'intermediate';
  return 'advanced';
}

function updateFlashcard() {
  if (filteredVocabulary.length === 0) {
    console.log('⚠️ No vocabulary to display');
    return;
  }
  
  const word = filteredVocabulary[currentUser.currentCard];
  const flashcard = document.getElementById('flashcard');
  
  // Update card content
  const elements = {
    cardCategory: document.getElementById('cardCategory'),
    arabicText: document.getElementById('arabicText'),
    pronunciation: document.getElementById('pronunciation'),
    usageNote: document.getElementById('usageNote'),
    englishText: document.getElementById('englishText'),
    frenchText: document.getElementById('frenchText'),
    exampleSentence: document.getElementById('exampleSentence')
  };
  
  if (elements.cardCategory) elements.cardCategory.textContent = word.category || 'Vocabulary';
  if (elements.arabicText) elements.arabicText.textContent = word.arabic;
  if (elements.pronunciation) elements.pronunciation.textContent = word.pronunciation;
  if (elements.usageNote) elements.usageNote.textContent = word.usage ? word.usage.replace('_', ' ') : '';
  if (elements.englishText) elements.englishText.textContent = word.english;
  if (elements.frenchText) elements.frenchText.textContent = word.french;
  if (elements.exampleSentence) {
    elements.exampleSentence.textContent = generateExampleSentence(word);
  }
  
  if (flashcard) {
    flashcard.classList.remove('flipped');
  }
  
  updateCardCounter();
  
  // Auto-play if enabled
  if (currentUser.autoPlayEnabled) {
    setTimeout(() => speakArabicText(word.arabic), 500);
  }
}

function generateExampleSentence(word) {
  // Simple example sentence generation
  const examples = {
    'hello': 'مرحبا، كيفك؟ (Hello, how are you?)',
    'thank you': 'شكراً كتير (Thank you very much)',
    'goodbye': 'مع السلامة، شوفك بكرا (Goodbye, see you tomorrow)',
    'water': 'بدي مي بارد (I want cold water)',
    'food': 'الأكل طيب كتير (The food is very good)'
  };
  
  return examples[word.english.toLowerCase()] || `Example: ${word.arabic} - ${word.english}`;
}

function updateCardCounter() {
  const currentCardEl = document.getElementById('currentCard');
  const totalCardsEl = document.getElementById('totalCards');
  
  if (currentCardEl) currentCardEl.textContent = currentUser.currentCard + 1;
  if (totalCardsEl) totalCardsEl.textContent = filteredVocabulary.length;
}

function handleMasteryFeedback(level) {
  const xpRewards = { easy: 15, medium: 10, hard: 5 };
  const messages = {
    easy: 'Great! Word marked as mastered! 🎉',
    medium: 'Good progress! Keep practicing! 👍',
    hard: 'No worries! Practice makes perfect! 💪'
  };
  
  awardXP(xpRewards[level]);
  showNotification(messages[level]);
  
  if (level === 'easy') {
    currentUser.masteredWords++;
  } else if (level === 'hard') {
    currentUser.difficultWords++;
  }
  
  updateEnhancedUI();
}

function updateLearningMode() {
  const mode = currentUser.learningMode;
  console.log('🎯 Switching to learning mode:', mode);
  
  switch (mode) {
    case 'quiz':
      showNotification('Quiz mode activated! 🧠');
      break;
    case 'listening':
      showNotification('Listening mode activated! 👂');
      if (currentVocabulary.length > 0) {
        const word = filteredVocabulary[currentUser.currentCard];
        speakArabicText(word.arabic);
      }
      break;
    default:
      showNotification('Flashcard mode activated! 📚');
  }
}

// Grammar Functions
function setupGrammarControls() {
  // Grammar controls will be set up when grammar topics are loaded
}

function loadGrammarTopics() {
  const grammarTopics = document.getElementById('grammarTopics');
  if (!grammarTopics) return;
  
  grammarTopics.innerHTML = '';
  
  const topics = appData.grammarTopics || [
    {id: 'pronouns', title: 'Personal Pronouns', description: 'Learn Lebanese Arabic personal pronouns with conjugations'},
    {id: 'verbs', title: 'Verb Conjugations', description: 'Master essential verb conjugations in Lebanese Arabic'},
    {id: 'demonstratives', title: 'This/That/These', description: 'Demonstrative pronouns and their usage'},
    {id: 'questions', title: 'Question Formation', description: 'How to ask questions in Lebanese Arabic'}
  ];
  
  topics.forEach(topic => {
    const topicCard = document.createElement('div');
    topicCard.className = 'grammar-topic';
    topicCard.setAttribute('data-topic', topic.id);
    
    topicCard.innerHTML = `
      <h3>${topic.title}</h3>
      <p>${topic.description}</p>
      <button class="btn btn--primary">Study Topic</button>
    `;
    
    topicCard.addEventListener('click', () => {
      selectGrammarTopic(topic);
    });
    
    grammarTopics.appendChild(topicCard);
  });
}

function selectGrammarTopic(topic) {
  console.log('📖 Selecting grammar topic:', topic.title);
  currentUser.currentGrammarTopic = topic.id;
  
  const grammarLesson = document.getElementById('grammarLesson');
  if (!grammarLesson) return;
  
  grammarLesson.innerHTML = generateGrammarContent(topic);
  
  // Update active state
  document.querySelectorAll('.grammar-topic').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-topic="${topic.id}"]`)?.classList.add('active');
  
  awardXP(10);
  showNotification(`Grammar lesson: ${topic.title} 📖`);
}

function generateGrammarContent(topic) {
  const content = {
    pronouns: `
      <div class="card">
        <div class="card__body">
          <h3>Personal Pronouns in Lebanese Arabic</h3>
          <table class="conjugation-table">
            <thead>
              <tr><th>English</th><th>Arabic</th><th>Pronunciation</th></tr>
            </thead>
            <tbody>
              <tr><td>I</td><td class="arabic">أنا</td><td>ana</td></tr>
              <tr><td>You (m)</td><td class="arabic">إنت</td><td>inte</td></tr>
              <tr><td>You (f)</td><td class="arabic">إنتِ</td><td>inti</td></tr>
              <tr><td>He</td><td class="arabic">هو</td><td>huwwe</td></tr>
              <tr><td>She</td><td class="arabic">هي</td><td>hiyye</td></tr>
              <tr><td>We</td><td class="arabic">نحن</td><td>nahna</td></tr>
              <tr><td>You (pl)</td><td class="arabic">إنتو</td><td>intu</td></tr>
              <tr><td>They</td><td class="arabic">هم</td><td>hunne</td></tr>
            </tbody>
          </table>
          <p><strong>Example:</strong> أنا بحبك (ana bahebak) - I love you</p>
        </div>
      </div>
    `,
    verbs: `
      <div class="card">
        <div class="card__body">
          <h3>Verb Conjugation: "To Go" (راح)</h3>
          <table class="conjugation-table">
            <thead>
              <tr><th>Pronoun</th><th>Present</th><th>Past</th><th>Future</th></tr>
            </thead>
            <tbody>
              <tr><td>أنا (I)</td><td>بروح</td><td>رحت</td><td>رح روح</td></tr>
              <tr><td>إنت (You m)</td><td>بتروح</td><td>رحت</td><td>رح تروح</td></tr>
              <tr><td>إنتِ (You f)</td><td>بتروحي</td><td>رحتِ</td><td>رح تروحي</td></tr>
              <tr><td>هو (He)</td><td>بيروح</td><td>راح</td><td>رح يروح</td></tr>
              <tr><td>هي (She)</td><td>بتروح</td><td>راحت</td><td>رح تروح</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `
  };
  
  return content[topic.id] || '<div class="card"><div class="card__body"><p>Grammar content coming soon...</p></div></div>';
}

// Radio Functions
function setupRadioControls() {
  const genreFilters = document.querySelectorAll('.filter-btn');
  genreFilters.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const genre = e.target.getAttribute('data-genre');
      filterRadioStations(genre);
      
      genreFilters.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
  
  const startRadioChallenge = document.getElementById('startRadioChallenge');
  if (startRadioChallenge) {
    startRadioChallenge.addEventListener('click', () => {
      startRadioListeningChallenge();
    });
  }
}

function loadRadioStations() {
  const radioStations = document.getElementById('radioStations');
  if (!radioStations) return;
  
  radioStations.innerHTML = '';
  
  appData.radioStations.forEach(station => {
    const stationCard = document.createElement('div');
    stationCard.className = 'radio-station';
    stationCard.setAttribute('data-genre', getGenreCategory(station.genre));
    
    stationCard.innerHTML = `
      <div class="radio-header">
        <div class="radio-name">${station.name}</div>
        <div class="radio-arabic arabic">${station.name_arabic}</div>
        <div class="radio-frequency">${station.frequency}</div>
      </div>
      <div class="radio-player">
        <div class="radio-description">${station.description}</div>
        <div class="radio-controls">
          <button class="btn btn--primary" onclick="playRadioStation('${station.name}')">🎵 Listen Live</button>
          <button class="btn btn--outline" onclick="bookmarkStation('${station.name}')">🔖 Bookmark</button>
        </div>
      </div>
    `;
    
    radioStations.appendChild(stationCard);
  });
  
  loadRadioPractice();
}

function getGenreCategory(genre) {
  if (genre.toLowerCase().includes('arabic') || genre.toLowerCase().includes('lebanese')) return 'arabic';
  if (genre.toLowerCase().includes('news') || genre.toLowerCase().includes('talk')) return 'news';
  if (genre.toLowerCase().includes('pop') || genre.toLowerCase().includes('international')) return 'pop';
  return 'arabic';
}

function filterRadioStations(genre) {
  const stations = document.querySelectorAll('.radio-station');
  stations.forEach(station => {
    if (genre === 'all' || station.getAttribute('data-genre') === genre) {
      station.style.display = 'block';
    } else {
      station.style.display = 'none';
    }
  });
}

function playRadioStation(stationName) {
  showNotification(`🎵 Opening ${stationName}...`);
  awardXP(3);
}

function bookmarkStation(stationName) {
  showNotification(`🔖 ${stationName} bookmarked!`);
}

function loadRadioPractice() {
  const radioPractice = document.getElementById('radioPractice');
  if (!radioPractice) return;
  
  const practiceWords = ['أخبار', 'موسيقى', 'لبنان', 'سياسة', 'رياضة', 'طقس', 'مرور'];
  
  radioPractice.innerHTML = '';
  practiceWords.forEach(word => {
    const phraseEl = document.createElement('span');
    phraseEl.className = 'practice-phrase arabic';
    phraseEl.textContent = word;
    radioPractice.appendChild(phraseEl);
  });
}

function startRadioListeningChallenge() {
  showNotification('🎯 Radio listening challenge started! Listen for the highlighted words.');
  awardXP(5);
}

// Podcast Functions
function setupPodcastControls() {
  const podcastLevel = document.getElementById('podcastLevel');
  if (podcastLevel) {
    podcastLevel.addEventListener('change', (e) => {
      filterPodcasts(e.target.value);
    });
  }
}

function loadPodcasts() {
  const podcastGrid = document.getElementById('podcastGrid');
  if (!podcastGrid) return;
  
  podcastGrid.innerHTML = '';
  
  appData.podcasts.forEach(podcast => {
    const podcastCard = document.createElement('div');
    podcastCard.className = 'podcast-card';
    podcastCard.setAttribute('data-level', podcast.level.toLowerCase());
    
    const rating = '⭐'.repeat(Math.floor(podcast.rating));
    
    podcastCard.innerHTML = `
      <div class="podcast-header">
        <div class="podcast-title">${podcast.name}</div>
        ${podcast.host ? `<div class="podcast-host">Host: ${podcast.host}</div>` : ''}
        <div class="podcast-rating">${rating} ${podcast.rating}</div>
      </div>
      <div class="podcast-body">
        <div class="podcast-description">${podcast.description}</div>
        <div class="podcast-meta">
          <span>Level: ${podcast.level}</span>
          ${podcast.format ? `<span>${podcast.format}</span>` : ''}
        </div>
        <div class="podcast-actions">
          <button class="btn btn--primary" onclick="playPodcast('${podcast.name}')">🎧 Listen</button>
          <button class="btn btn--outline" onclick="subscribePodcast('${podcast.name}')">➕ Subscribe</button>
        </div>
      </div>
    `;
    
    podcastGrid.appendChild(podcastCard);
  });
}

function filterPodcasts(level) {
  const podcasts = document.querySelectorAll('.podcast-card');
  podcasts.forEach(podcast => {
    if (level === 'all' || podcast.getAttribute('data-level') === level) {
      podcast.style.display = 'block';
    } else {
      podcast.style.display = 'none';
    }
  });
}

function playPodcast(podcastName) {
  showNotification(`🎧 Playing: ${podcastName}`);
  awardXP(5);
}

function subscribePodcast(podcastName) {
  showNotification(`➕ Subscribed to ${podcastName}!`);
}

// TV Show Functions
function setupTVShowControls() {
  // TV show controls are handled directly in the loadTVShows function
}

function loadTVShows() {
  const tvShowGrid = document.getElementById('tvShowGrid');
  if (!tvShowGrid) return;
  
  tvShowGrid.innerHTML = '';
  
  appData.tvShows.forEach(show => {
    const showCard = document.createElement('div');
    showCard.className = 'tv-show-card';
    
    const subtitles = show.subtitles ? show.subtitles.map(sub => 
      `<span class="subtitle-tag">${sub}</span>`
    ).join('') : '';
    
    showCard.innerHTML = `
      <div class="tv-show-poster">📺</div>
      <div class="tv-show-content">
        <div class="tv-show-title">${show.title}</div>
        <div class="tv-show-arabic arabic">${show.title_arabic}</div>
        <div class="tv-show-type">${show.type}</div>
        <div class="tv-show-description">${show.description}</div>
        ${subtitles ? `<div class="subtitles-available">${subtitles}</div>` : ''}
        <div class="tv-show-actions">
          <button class="btn btn--primary" onclick="watchShow('${show.title}')">▶️ Watch</button>
          <button class="btn btn--outline" onclick="addToWatchlist('${show.title}')">📌 Watchlist</button>
        </div>
      </div>
    `;
    
    tvShowGrid.appendChild(showCard);
  });
}

function watchShow(showTitle) {
  showNotification(`▶️ Opening ${showTitle}...`);
  awardXP(8);
}

function addToWatchlist(showTitle) {
  showNotification(`📌 ${showTitle} added to watchlist!`);
}

// Culture Functions
function setupCultureControls() {
  const cultureTabs = document.querySelectorAll('.culture-tab');
  cultureTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabType = e.target.getAttribute('data-tab');
      
      cultureTabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      document.querySelectorAll('.culture-section-content').forEach(content => {
        content.classList.remove('active');
      });
      
      document.getElementById(`${tabType}-content`)?.classList.add('active');
      
      loadCultureSection(tabType);
    });
  });
}

function loadCultureContent() {
  loadCultureSection('traditions');
}

function loadCultureSection(sectionType) {
  switch (sectionType) {
    case 'traditions':
      loadTraditions();
      break;
    case 'figures':
      loadFamousFigures();
      break;
    case 'cuisine':
      loadCuisineInfo();
      break;
    case 'music':
      loadMusicInfo();
      break;
  }
}

function loadTraditions() {
  const traditionsGrid = document.getElementById('traditionsGrid');
  if (!traditionsGrid) return;
  
  traditionsGrid.innerHTML = '';
  
  const traditions = appData.culture.traditions || [
    {name: 'Dabke Dance', name_arabic: 'دبكة', description: 'Traditional Lebanese folk dance performed in lines, originally used to help fix mud roofs but became a celebration dance.'},
    {name: 'Lebanese Hospitality', name_arabic: 'الضيافة اللبنانية', description: 'Sacred tradition of welcoming guests with coffee, tea, and the famous three-kiss greeting.'},
    {name: 'Zaffe Wedding', name_arabic: 'الزفة', description: 'Traditional Lebanese wedding procession with drums, music, and dancing.'},
    {name: 'Al Zajal Poetry', name_arabic: 'الزجل', description: 'Traditional form of oral poetry with improvised verses and competitions.'}
  ];
  
  traditions.forEach(tradition => {
    const traditionCard = document.createElement('div');
    traditionCard.className = 'tradition-card';
    
    traditionCard.innerHTML = `
      <div class="tradition-name">${tradition.name}</div>
      <div class="tradition-arabic arabic">${tradition.name_arabic}</div>
      <div class="tradition-description">${tradition.description}</div>
      <button class="btn btn--outline" onclick="learnMoreTradition('${tradition.name}')">Learn More</button>
    `;
    
    traditionsGrid.appendChild(traditionCard);
  });
}

function loadFamousFigures() {
  const figuresGrid = document.getElementById('figuresGrid');
  if (!figuresGrid) return;
  
  figuresGrid.innerHTML = '';
  
  const figures = appData.culture.figures || [
    {name: 'Fairuz', name_arabic: 'فيروز', description: 'Legendary Lebanese singer known as "Ambassador to the Stars, Neighbor to the Moon". Born in 1935, she is considered the voice of Lebanon.'},
    {name: 'Gibran Khalil Gibran', name_arabic: 'جبران خليل جبران', description: 'Renowned Lebanese-American writer, poet, and visual artist, author of "The Prophet".'},
    {name: 'Marcel Khalife', name_arabic: 'مارسيل خليفة', description: 'Influential Lebanese composer, singer, and oud player known for his political songs.'}
  ];
  
  figures.forEach(figure => {
    const figureCard = document.createElement('div');
    figureCard.className = 'figure-card';
    
    figureCard.innerHTML = `
      <div class="figure-name">${figure.name}</div>
      <div class="figure-arabic arabic">${figure.name_arabic}</div>
      <div class="figure-description">${figure.description}</div>
      <button class="btn btn--outline" onclick="learnMoreFigure('${figure.name}')">Learn More</button>
    `;
    
    figuresGrid.appendChild(figureCard);
  });
}

function loadCuisineInfo() {
  // Cuisine content would be loaded here
  console.log('Loading cuisine information...');
}

function loadMusicInfo() {
  // Music content would be loaded here
  console.log('Loading music information...');
}

function learnMoreTradition(traditionName) {
  showNotification(`📖 Learning about ${traditionName}...`);
  awardXP(5);
}

function learnMoreFigure(figureName) {
  showNotification(`👤 Learning about ${figureName}...`);
  awardXP(5);
}

// Enhanced Translation Functions
function setupEnhancedTranslationControls() {
  const translateBtn = document.getElementById('translateBtn');
  const inputText = document.getElementById('inputText');
  const playTranslation = document.getElementById('playTranslation');
  const saveTranslation = document.getElementById('saveTranslation');
  const shareTranslation = document.getElementById('shareTranslation');
  const swapLanguages = document.getElementById('swapLanguages');

  if (translateBtn) {
    translateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      performEnhancedTranslation();
    });
  }
  
  if (inputText) {
    inputText.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        performEnhancedTranslation();
      }
    });
  }

  if (playTranslation) {
    playTranslation.addEventListener('click', (e) => {
      e.preventDefault();
      const arabicOutput = document.getElementById('arabicOutput');
      if (arabicOutput && arabicOutput.textContent !== 'Translation will appear here...') {
        speakArabicText(arabicOutput.textContent);
      }
    });
  }

  if (saveTranslation) {
    saveTranslation.addEventListener('click', (e) => {
      e.preventDefault();
      saveCurrentTranslation();
    });
  }

  if (shareTranslation) {
    shareTranslation.addEventListener('click', (e) => {
      e.preventDefault();
      shareCurrentTranslation();
    });
  }

  if (swapLanguages) {
    swapLanguages.addEventListener('click', (e) => {
      e.preventDefault();
      swapTranslationLanguages();
    });
  }

  // Translation mode switching
  const modeButtons = document.querySelectorAll('.mode-btn');
  modeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.target.getAttribute('data-mode');
      switchTranslationMode(mode);
      
      modeButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  // Phrase categories
  const phraseTabs = document.querySelectorAll('.phrase-tab');
  phraseTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const category = e.target.getAttribute('data-category');
      loadPhraseCategory(category);
      
      phraseTabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
}

function loadEnhancedTranslation() {
  loadPhraseCategory('daily');
  loadTranslationHistory();
}

function performEnhancedTranslation() {
  const inputText = document.getElementById('inputText');
  const arabicOutput = document.getElementById('arabicOutput');
  const pronunciationOutput = document.getElementById('pronunciationOutput');
  const playButton = document.getElementById('playTranslation');
  const saveButton = document.getElementById('saveTranslation');
  const shareButton = document.getElementById('shareTranslation');
  const statusEl = document.getElementById('translationStatus');

  if (!inputText) return;

  const text = inputText.value.trim();
  if (!text) {
    clearTranslationOutput();
    return;
  }

  if (statusEl) statusEl.textContent = 'Translating...';

  // Enhanced translation with vocabulary lookup
  const translation = findEnhancedTranslation(text.toLowerCase());
  
  if (translation) {
    displayTranslation(translation);
    if (statusEl) statusEl.textContent = 'Translation from vocabulary database';
  } else {
    // Simulate enhanced translation service
    simulateEnhancedTranslation(text).then(translation => {
      displayTranslation(translation);
      if (statusEl) statusEl.textContent = 'Translation completed';
    }).catch(error => {
      console.error('Translation error:', error);
      if (statusEl) statusEl.textContent = 'Translation failed';
    });
  }

  function displayTranslation(translation) {
    if (arabicOutput) arabicOutput.textContent = translation.arabic;
    if (pronunciationOutput) pronunciationOutput.textContent = translation.pronunciation;
    if (playButton) playButton.style.display = 'inline-flex';
    if (saveButton) saveButton.style.display = 'inline-flex';
    if (shareButton) shareButton.style.display = 'inline-flex';
    
    awardXP(3);
    
    // Add to history
    addToTranslationHistory(text, translation);
  }
}

function findEnhancedTranslation(text) {
  // Enhanced search through vocabulary
  for (const word of allVocabulary) {
    if (word.english.toLowerCase().includes(text) || 
        word.french.toLowerCase().includes(text) ||
        text.includes(word.english.toLowerCase()) ||
        text.includes(word.french.toLowerCase())) {
      return word;
    }
  }
  return null;
}

async function simulateEnhancedTranslation(text) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const patterns = {
    'good morning': {arabic: 'صباح الخير', pronunciation: 'sabah el kheir'},
    'good evening': {arabic: 'مساء الخير', pronunciation: 'masa el kheir'},
    'how much': {arabic: 'قديش؟', pronunciation: 'adeysh?'},
    'where is': {arabic: 'وين؟', pronunciation: 'wayn?'},
    'i want': {arabic: 'بدي', pronunciation: 'biddi'},
    'excuse me': {arabic: 'عفواً', pronunciation: '3afwan'},
    'please': {arabic: 'من فضلك', pronunciation: 'min fadlak'},
    'help': {arabic: 'مساعدة', pronunciation: 'mosa3ade'},
    'restaurant': {arabic: 'مطعم', pronunciation: 'mat3am'},
    'hotel': {arabic: 'فندق', pronunciation: 'fondo2'},
    'airport': {arabic: 'مطار', pronunciation: 'matar'},
    'hospital': {arabic: 'مستشفى', pronunciation: 'mustashfa'}
  };
  
  const lowerText = text.toLowerCase();
  for (const [key, translation] of Object.entries(patterns)) {
    if (lowerText.includes(key)) {
      return translation;
    }
  }
  
  return {
    arabic: 'ترجمة تقديرية',
    pronunciation: 'tarjamat takdiriyyah'
  };
}

function clearTranslationOutput() {
  const arabicOutput = document.getElementById('arabicOutput');
  const pronunciationOutput = document.getElementById('pronunciationOutput');
  const playButton = document.getElementById('playTranslation');
  const saveButton = document.getElementById('saveTranslation');
  const shareButton = document.getElementById('shareTranslation');
  
  if (arabicOutput) arabicOutput.textContent = 'Translation will appear here...';
  if (pronunciationOutput) pronunciationOutput.textContent = '';
  if (playButton) playButton.style.display = 'none';
  if (saveButton) saveButton.style.display = 'none';
  if (shareButton) shareButton.style.display = 'none';
}

function saveCurrentTranslation() {
  const inputText = document.getElementById('inputText');
  const arabicOutput = document.getElementById('arabicOutput');
  const pronunciationOutput = document.getElementById('pronunciationOutput');
  
  if (inputText && arabicOutput && arabicOutput.textContent !== 'Translation will appear here...') {
    const translation = {
      original: inputText.value,
      arabic: arabicOutput.textContent,
      pronunciation: pronunciationOutput.textContent,
      timestamp: new Date().toLocaleString()
    };
    
    currentUser.savedTranslations.push(translation);
    showNotification('💾 Translation saved!');
    awardXP(2);
  }
}

function shareCurrentTranslation() {
  const arabicOutput = document.getElementById('arabicOutput');
  if (arabicOutput && arabicOutput.textContent !== 'Translation will appear here...') {
    if (navigator.share) {
      navigator.share({
        title: 'Lebanese Arabic Translation',
        text: arabicOutput.textContent
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(arabicOutput.textContent).then(() => {
        showNotification('📤 Translation copied to clipboard!');
      });
    }
  }
}

function swapTranslationLanguages() {
  const fromLang = document.getElementById('fromLang');
  const inputText = document.getElementById('inputText');
  const arabicOutput = document.getElementById('arabicOutput');
  
  if (fromLang && inputText && arabicOutput) {
    const temp = inputText.value;
    inputText.value = arabicOutput.textContent === 'Translation will appear here...' ? '' : arabicOutput.textContent;
    
    if (fromLang.value === 'ar') {
      fromLang.value = 'en';
    } else {
      fromLang.value = 'ar';
    }
    
    clearTranslationOutput();
    showNotification('⇄ Languages swapped');
  }
}

function switchTranslationMode(mode) {
  console.log('🔄 Switching translation mode:', mode);
  
  switch (mode) {
    case 'conversation':
      showNotification('💬 Conversation mode activated');
      break;
    case 'camera':
      showNotification('📷 Photo translation mode activated');
      break;
    default:
      showNotification('📝 Text translation mode activated');
  }
}

function loadPhraseCategory(category) {
  const phraseGrid = document.getElementById('phraseGrid');
  if (!phraseGrid) return;
  
  phraseGrid.innerHTML = '';
  
  const phraseCategories = {
    daily: [
      {arabic: 'كيفك؟', pronunciation: 'kifak?', english: 'How are you?', french: 'Comment allez-vous?'},
      {arabic: 'شو عم تعمل؟', pronunciation: 'shu 3am ta3mel?', english: 'What are you doing?', french: 'Que fais-tu?'},
      {arabic: 'وين رايح؟', pronunciation: 'wayn rayeh?', english: 'Where are you going?', french: 'Où vas-tu?'},
      {arabic: 'قديش الساعة؟', pronunciation: 'adeysh el sa3a?', english: 'What time is it?', french: 'Quelle heure est-il?'}
    ],
    travel: [
      {arabic: 'وين المطار؟', pronunciation: 'wayn el matar?', english: 'Where is the airport?', french: 'Où est l\'aéroport?'},
      {arabic: 'بدي تذكرة', pronunciation: 'biddi tazkara', english: 'I want a ticket', french: 'Je veux un billet'},
      {arabic: 'قديش الأجرة؟', pronunciation: 'adeysh el ojra?', english: 'How much is the fare?', french: 'Combien coûte le trajet?'}
    ],
    dining: [
      {arabic: 'بدي آكل', pronunciation: 'biddi ekol', english: 'I want to eat', french: 'Je veux manger'},
      {arabic: 'الحساب لو سمحت', pronunciation: 'el hesab law samaht', english: 'The bill please', french: 'L\'addition s\'il vous plaît'},
      {arabic: 'الأكل طيب', pronunciation: 'el akl tayeb', english: 'The food is good', french: 'La nourriture est bonne'}
    ],
    emergency: [
      {arabic: 'ساعدوني', pronunciation: 'sa3duni', english: 'Help me', french: 'Aidez-moi'},
      {arabic: 'إتصل بالشرطة', pronunciation: 'itasal bel shorta', english: 'Call the police', french: 'Appelez la police'},
      {arabic: 'وين المستشفى؟', pronunciation: 'wayn el mustashfa?', english: 'Where is the hospital?', french: 'Où est l\'hôpital?'}
    ]
  };
  
  const phrases = phraseCategories[category] || phraseCategories.daily;
  
  phrases.forEach(phrase => {
    const phraseCard = document.createElement('div');
    phraseCard.className = 'phrase-card';
    
    phraseCard.innerHTML = `
      <div class="phrase-arabic">${phrase.arabic}</div>
      <div class="phrase-pronunciation">${phrase.pronunciation}</div>
      <div class="phrase-translations">
        <div><strong>EN:</strong> ${phrase.english}</div>
        <div><strong>FR:</strong> ${phrase.french}</div>
      </div>
    `;
    
    phraseCard.addEventListener('click', () => {
      usePhrase(phrase);
    });
    
    phraseGrid.appendChild(phraseCard);
  });
}

function usePhrase(phrase) {
  const inputText = document.getElementById('inputText');
  const arabicOutput = document.getElementById('arabicOutput');
  const pronunciationOutput = document.getElementById('pronunciationOutput');
  const playTranslation = document.getElementById('playTranslation');
  const saveTranslation = document.getElementById('saveTranslation');
  const shareTranslation = document.getElementById('shareTranslation');
  
  if (inputText) inputText.value = phrase.english;
  if (arabicOutput) arabicOutput.textContent = phrase.arabic;
  if (pronunciationOutput) pronunciationOutput.textContent = phrase.pronunciation;
  if (playTranslation) playTranslation.style.display = 'inline-flex';
  if (saveTranslation) saveTranslation.style.display = 'inline-flex';
  if (shareTranslation) shareTranslation.style.display = 'inline-flex';
  
  showNotification('✅ Phrase selected');
}

function addToTranslationHistory(original, translation) {
  const historyItem = {
    original,
    arabic: translation.arabic,
    pronunciation: translation.pronunciation,
    timestamp: new Date().toLocaleString()
  };
  
  currentUser.translationHistory.unshift(historyItem);
  if (currentUser.translationHistory.length > 50) {
    currentUser.translationHistory = currentUser.translationHistory.slice(0, 50);
  }
  
  updateTranslationHistory();
}

function loadTranslationHistory() {
  updateTranslationHistory();
}

function updateTranslationHistory() {
  const historyList = document.getElementById('translationHistory');
  if (!historyList) return;
  
  historyList.innerHTML = '';
  
  if (currentUser.translationHistory.length === 0) {
    historyList.innerHTML = '<p class="text-secondary">No translation history yet</p>';
    return;
  }
  
  currentUser.translationHistory.slice(0, 10).forEach((item, index) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    historyItem.innerHTML = `
      <div class="history-item-text">
        <div><strong>${item.original}</strong> → <span class="arabic">${item.arabic}</span></div>
        <div class="pronunciation">${item.pronunciation}</div>
        <small>${item.timestamp}</small>
      </div>
      <div class="history-item-controls">
        <button class="btn btn--sm audio-btn" onclick="speakArabicText('${item.arabic}')">🔊</button>
        <button class="btn btn--sm btn--outline" onclick="removeFromHistory(${index})">×</button>
      </div>
    `;
    
    historyList.appendChild(historyItem);
  });
}

function removeFromHistory(index) {
  currentUser.translationHistory.splice(index, 1);
  updateTranslationHistory();
  showNotification('Translation removed from history');
}

// Enhanced Profile Functions
function setupEnhancedProfileControls() {
  const dailyGoal = document.getElementById('dailyGoal');
  const difficultyLevel = document.getElementById('difficultyLevel');
  const audioEnabled = document.getElementById('audioEnabled');
  const slowAudioEnabled = document.getElementById('slowAudioEnabled');
  const autoPlayEnabled = document.getElementById('autoPlayEnabled');
  const dailyReminders = document.getElementById('dailyReminders');
  const streakReminders = document.getElementById('streakReminders');
  const achievementNotifications = document.getElementById('achievementNotifications');
  const saveSettings = document.getElementById('saveSettings');

  // Load current settings
  if (dailyGoal) dailyGoal.value = currentUser.dailyGoal;
  if (difficultyLevel) difficultyLevel.value = currentUser.proficiency;
  if (audioEnabled) audioEnabled.checked = currentUser.audioEnabled;
  if (slowAudioEnabled) slowAudioEnabled.checked = currentUser.slowAudioEnabled;
  if (autoPlayEnabled) autoPlayEnabled.checked = currentUser.autoPlayEnabled;
  if (dailyReminders) dailyReminders.checked = currentUser.dailyReminders;
  if (streakReminders) streakReminders.checked = currentUser.streakReminders;
  if (achievementNotifications) achievementNotifications.checked = currentUser.achievementNotifications;

  if (saveSettings) {
    saveSettings.addEventListener('click', (e) => {
      e.preventDefault();
      saveUserSettings();
    });
  }

  // Individual setting handlers
  if (dailyGoal) {
    dailyGoal.addEventListener('change', (e) => {
      currentUser.dailyGoal = parseInt(e.target.value);
    });
  }

  if (difficultyLevel) {
    difficultyLevel.addEventListener('change', (e) => {
      currentUser.proficiency = e.target.value;
    });
  }

  if (audioEnabled) {
    audioEnabled.addEventListener('change', (e) => {
      currentUser.audioEnabled = e.target.checked;
    });
  }

  if (slowAudioEnabled) {
    slowAudioEnabled.addEventListener('change', (e) => {
      currentUser.slowAudioEnabled = e.target.checked;
    });
  }

  if (autoPlayEnabled) {
    autoPlayEnabled.addEventListener('change', (e) => {
      currentUser.autoPlayEnabled = e.target.checked;
    });
  }

  if (dailyReminders) {
    dailyReminders.addEventListener('change', (e) => {
      currentUser.dailyReminders = e.target.checked;
    });
  }

  if (streakReminders) {
    streakReminders.addEventListener('change', (e) => {
      currentUser.streakReminders = e.target.checked;
    });
  }

  if (achievementNotifications) {
    achievementNotifications.addEventListener('change', (e) => {
      currentUser.achievementNotifications = e.target.checked;
    });
  }
}

function updateEnhancedProfile() {
  updateEnhancedUI();
  updateProgressChart();
}

function saveUserSettings() {
  showNotification('⚙️ Settings saved successfully!');
  awardXP(5);
}

// News Functions (Enhanced from previous version)
function loadNewsChannels() {
  const newsChannels = document.getElementById('newsChannels');
  if (!newsChannels) return;
  
  newsChannels.innerHTML = '';
  
  appData.newsChannels.forEach(channel => {
    const channelCard = document.createElement('div');
    channelCard.className = 'news-channel';
    
    channelCard.innerHTML = `
      <div class="news-channel-header">
        <div class="news-channel-name">${channel.name}</div>
        <div class="news-channel-arabic arabic">${channel.name_arabic}</div>
        <p>${channel.description}</p>
      </div>
      <div class="news-embed">
        <div class="news-placeholder">
          <span>📺</span>
          <p>Live Stream</p>
          <small>Click to visit ${channel.name}</small>
        </div>
      </div>
      <div class="news-actions">
        <button class="btn btn--primary" onclick="watchNews('${channel.name}')">📺 Watch Live</button>
        <button class="btn btn--outline" onclick="bookmarkNews('${channel.name}')">🔖 Bookmark</button>
      </div>
    `;
    
    newsChannels.appendChild(channelCard);
  });
  
  loadNewsVocabulary();
}

function loadNewsVocabulary() {
  const newsTerms = document.getElementById('newsTerms');
  if (!newsTerms) return;
  
  const terms = [
    {arabic: 'أخبار', english: 'news'},
    {arabic: 'سياسة', english: 'politics'},
    {arabic: 'اقتصاد', english: 'economy'},
    {arabic: 'رياضة', english: 'sports'},
    {arabic: 'طقس', english: 'weather'},
    {arabic: 'مجتمع', english: 'society'},
    {arabic: 'حكومة', english: 'government'},
    {arabic: 'انتخابات', english: 'elections'}
  ];
  
  newsTerms.innerHTML = '';
  terms.forEach(term => {
    const termCard = document.createElement('div');
    termCard.className = 'news-term';
    
    termCard.innerHTML = `
      <div class="news-term-arabic">${term.arabic}</div>
      <div class="news-term-english">${term.english}</div>
    `;
    
    newsTerms.appendChild(termCard);
  });
}

function watchNews(channelName) {
  showNotification(`📺 Opening ${channelName} live stream...`);
  awardXP(5);
}

function bookmarkNews(channelName) {
  showNotification(`🔖 ${channelName} bookmarked!`);
}

// Enhanced Audio Functions
function initializeVoices() {
  console.log('🎤 Initializing enhanced TTS voices...');
  
  function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
    const arabicVoices = availableVoices.filter(voice => 
      voice.lang.includes('ar') || 
      voice.name.toLowerCase().includes('arabic')
    );
    
    console.log('Available Arabic voices:', arabicVoices.length);
    selectedVoice = arabicVoices[0] || availableVoices.find(v => v.lang.includes('en'));
  }
  
  loadVoices();
  speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

function speakArabicText(text, rate = 1.0) {
  if (!currentUser.audioEnabled) {
    showNotification('🔇 Audio is disabled in settings');
    return;
  }
  
  if (!speechSynthesis) {
    showNotification('❌ Text-to-speech not supported');
    return;
  }
  
  // Stop any current speech
  if (currentAudio) {
    speechSynthesis.cancel();
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  utterance.lang = 'ar-SA';
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  utterance.onstart = function() {
    console.log('🔊 Playing Arabic text:', text);
    currentAudio = utterance;
  };
  
  utterance.onend = function() {
    currentAudio = null;
  };
  
  utterance.onerror = function(event) {
    console.error('Speech synthesis error:', event.error);
    showNotification('❌ Speech playback failed');
    currentAudio = null;
  };
  
  speechSynthesis.speak(utterance);
}

// Enhanced UI Updates
function updateEnhancedUI() {
  updateXPDisplay();
  updateLevelDisplay();
  updateWordsLearned();
  updateProgressBars();
  updateDetailedStats();
  updateStreakDisplay();
  updateAchievements();
}

function updateXPDisplay() {
  const xpElements = document.querySelectorAll('#userXP, #profileXP');
  xpElements.forEach(el => el.textContent = currentUser.xp);
}

function updateLevelDisplay() {
  const levelNames = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const levelName = levelNames[currentUser.level - 1] || 'Beginner';
  const levelElements = document.querySelectorAll('#userLevel, #profileLevel');
  levelElements.forEach(el => el.textContent = levelName);
}

function updateWordsLearned() {
  const elements = document.querySelectorAll('#wordsLearned, #masteredWords');
  elements.forEach(el => el.textContent = currentUser.masteredWords);
}

function updateProgressBars() {
  const maxXP = [500, 1000, 2000, 5000][currentUser.level - 1] || 500;
  const progress = (currentUser.xp / maxXP) * 100;
  
  const progressElements = document.querySelectorAll('#profileProgress');
  progressElements.forEach(el => el.style.width = `${Math.min(progress, 100)}%`);
}

function updateDetailedStats() {
  const elements = {
    totalWords: document.getElementById('totalWords'),
    masteredWords: document.getElementById('masteredWords'),
    studyTime: document.getElementById('studyTime'),
    streakCount: document.getElementById('streakCount')
  };
  
  if (elements.totalWords) elements.totalWords.textContent = currentUser.totalWords;
  if (elements.masteredWords) elements.masteredWords.textContent = currentUser.masteredWords;
  if (elements.studyTime) elements.studyTime.textContent = `${currentUser.studyTime}h`;
  if (elements.streakCount) elements.streakCount.textContent = currentUser.streakDays;
}

function updateStreakDisplay() {
  const streakElements = document.querySelectorAll('#streakDays');
  streakElements.forEach(el => el.textContent = currentUser.streakDays);
}

function updateAchievements() {
  const achievementBadges = document.querySelectorAll('.badge');
  achievementBadges.forEach(badge => {
    const badgeText = badge.textContent.toLowerCase();
    if (currentUser.achievements.some(achievement => badgeText.includes(achievement.replace('_', ' ')))) {
      badge.classList.add('earned');
      badge.classList.remove('pending');
    }
  });
}

function setupProgressChart() {
  setTimeout(() => {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    // Create a simple progress visualization without Chart.js
    const data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      xpData: [25, 35, 28, 45, 38, 42, 50],
      wordData: [5, 7, 4, 8, 6, 9, 10]
    };

    // Create simple SVG chart
    ctx.innerHTML = `
      <div style="text-align: center; padding: 20px; background: var(--color-bg-1); border-radius: 8px;">
        <h4 style="margin-bottom: 16px;">Weekly Progress</h4>
        <div style="display: flex; justify-content: space-around; margin-bottom: 12px;">
          ${data.labels.map((label, i) => `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 20px; height: ${data.xpData[i] * 2}px; background: var(--color-primary); margin-bottom: 4px; border-radius: 2px;"></div>
              <small>${label}</small>
            </div>
          `).join('')}
        </div>
        <div style="display: flex; gap: 20px; justify-content: center; font-size: 14px;">
          <div><span style="color: var(--color-primary);">■</span> XP Earned</div>
          <div><span style="color: var(--color-warning);">■</span> Words Learned</div>
        </div>
      </div>
    `;
  }, 1000);
}

function updateProgressChart() {
  if (!progressChart) {
    setupProgressChart();
    return;
  }
  
  // Update chart data dynamically
  const newXpData = [25, 35, 28, 45, 38, 42, Math.min(currentUser.xp, 100)];
  const newWordData = [5, 7, 4, 8, 6, 9, Math.min(currentUser.wordsLearned, 20)];
  
  progressChart.data.datasets[0].data = newXpData;
  progressChart.data.datasets[1].data = newWordData;
  progressChart.update();
}

function awardXP(amount) {
  currentUser.xp += amount;
  currentUser.wordsLearned = Math.min(currentUser.wordsLearned + 1, currentUser.totalWords);
  updateEnhancedUI();
  
  // Check for level up
  const maxXP = [500, 1000, 2000, 5000][currentUser.level - 1] || 500;
  if (currentUser.xp >= maxXP && currentUser.level < 4) {
    currentUser.level++;
    currentUser.xp = 0;
    const levelNames = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    showNotification(`🎉 Level up! You're now ${levelNames[currentUser.level - 1]}!`);
    
    // Award achievement
    if (!currentUser.achievements.includes('level_up')) {
      currentUser.achievements.push('level_up');
      showNotification('🏆 Achievement unlocked: Level Up!');
    }
  } else {
    showNotification(`+${amount} XP earned! 🌟`);
  }
  
  // Check for streak achievements
  if (currentUser.streakDays >= 7 && !currentUser.achievements.includes('week_streak')) {
    currentUser.achievements.push('week_streak');
    showNotification('🔥 Achievement unlocked: Week Streak!');
  }
}

function showNotification(message) {
  console.log('📢 Notification:', message);
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-success);
    color: var(--color-btn-primary-text);
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 350px;
    word-wrap: break-word;
    font-size: 14px;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize first content after data loads
setTimeout(() => {
  if (allVocabulary.length > 0) {
    selectCategory('all');
    updateFlashcard();
  }
  updateTranslationHistory();
  updateEnhancedUI();
}, 1500);

console.log('✅ Enhanced Lebanese Arabic Learning Platform loaded successfully!');