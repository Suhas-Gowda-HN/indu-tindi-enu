// ==========================================================================
// Indu Tindi Enu? (ಇಂದು ತಿಂಡಿ ಏನು?) - Application Logic v2
// Now uses brass thali plate visuals instead of stock photos
// ==========================================================================

const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Application State
const state = {
  currentLang: localStorage.getItem("indu_lang") || "en",
  selectedDay: getActualCurrentDay(),
  activeTab: "today",
  currentFeaturedDishId: null,
  batterReady: localStorage.getItem("indu_batter_ready") !== "false",
  batterInFridge: localStorage.getItem("indu_batter_fridge") === "true",
  filterLate: false,
  filterVegOnly: false,
  isSpinning: false,
  wheelAngle: 0,
  groceryCheckedState: JSON.parse(localStorage.getItem("indu_grocery_checked") || "{}")
};

// UI Text Dictionary for English & Kannada
const I18N = {
  en: {
    appTitle: "Indu Tindi Enu?",
    appSubtitle: "What's for breakfast today? · ಇಂದು ತಿಂಡಿ ಏನು?",
    langBtn: "ಕನ್ನಡ",
    today: "Today",
    week: "Week",
    batter: "Batter",
    grocery: "Grocery",
    more: "More",
    recommendationTitle: "Today's Recommendation",
    servedWith: "Served with:",
    spinBreakfastBtn: "Spin for breakfast",
    rerollBtn: "Not today (Reroll)",
    recipeBtn: "Recipe",
    spinTitle: "Spin the Breakfast Wheel",
    spinSub: "Can't decide? Let the wheel pick randomly from today's 7 options!",
    spinActionText: "Spin the Wheel!",
    poolTitle: "Today's 7 Breakfast Options",
    poolSub: "Every day has a fixed pool of 7 authentic South Indian choices",
    dishesCount: "7 Dishes",
    quickView: "View Recipe →",
    makePick: "Make this today's pick",
    batterHeroTitle: "Evening Batter Reminder (7:00 PM)",
    batterHeroDesc: "Idli, dosa and vada need batter prepared the day before! Check what's needed tonight so tomorrow's breakfast is guaranteed fresh and ready.",
    batterToggleTitle: "Batter prepared tonight?",
    batterToggleDesc: "When ticked, the wheel suggests batter-based dishes. If unticked, it prioritizes instant options.",
    fridgeToggleTitle: "Leftover batter in fridge?",
    fridgeToggleDesc: "One batch of idli/dosa batter lasts 2-3 days in refrigerator.",
    batterTableTitle: "Batter Preparation & Soaking Guide",
    batterTableSub: "Authentic ratios, soaking durations, and fermentation tips",
    groceryTitle: "Weekly Grocery Checklist",
    grocerySub: "All essential ingredients for the entire week's South Indian breakfast menu",
    resetGrocery: "Reset List",
    filterTitle: "Smart Breakfast Filters",
    filterLateTitle: "\"I'm Late\" Mode (≤ 20 mins)",
    filterLateSub: "Filter pool to fast dishes like Poha, Upma, or Rava Idli",
    filterVegTitle: "Veg Only Today",
    filterVegSub: "Hide egg dishes from today's selection",
    shareTitle: "Share Today's Breakfast",
    shareSub: "Let your family or roommates know what's cooking this morning with a single tap!",
    shareBtn: "Share on WhatsApp",
    aboutTitle: "About \"Indu Tindi Enu?\"",
    toastPicked: "Today's breakfast chosen: ",
    toastCopied: "Shared to WhatsApp!",
    eggBadge: "🥚 Egg",
    mandyaBadge: "⭐ Mandya Special",
    batterBadge: "🧂 Needs Batter",
    instantBadge: "⚡ Instant Prep",
    viewDay: "View in Today view →"
  },
  kn: {
    appTitle: "ಇಂದು ತಿಂಡಿ ಏನು?",
    appSubtitle: "ದೈನಂದಿನ ದಕ್ಷಿಣ ಭಾರತೀಯ ಮತ್ತು ಕರ್ನಾಟಕ ಶೈಲಿಯ ತಿಂಡಿ ಮಾರ್ಗದರ್ಶಿ",
    langBtn: "English",
    today: "ಇಂದು",
    week: "ವಾರ",
    batter: "ಹಿಟ್ಟು",
    grocery: "ಪಟ್ಟಿ",
    more: "ಇನ್ನಷ್ಟು",
    recommendationTitle: "ಇಂದಿನ ವಿಶೇಷ ತಿಂಡಿ",
    servedWith: "ಜೊತೆಗೆ ನೀಡುವ ನೆಂಜಿಕೆಗಳು:",
    spinBreakfastBtn: "ಚಕ್ರ ತಿರುಗಿಸಿ ತಿಂಡಿ ಆರಿಸಿ",
    rerollBtn: "ಇವತ್ತಲ್ಲ (ಬೇರೆ ಆರಿಸಿ)",
    recipeBtn: "ಪಾಕವಿಧಾನ",
    spinTitle: "ತಿಂಡಿಯ ಚಕ್ರ ತಿರುಗಿಸಿ",
    spinSub: "ನಿರ್ಧರಿಸಲು ಕಷ್ಟವಾಗಿದೆಯೇ? ಇಂದಿನ ೭ ತಿಂಡಿಗಳಲ್ಲಿ ಒಂದನ್ನು ಚಕ್ರವೇ ಆರಿಸಲಿ!",
    spinActionText: "ಚಕ್ರ ತಿರುಗಿಸಿ!",
    poolTitle: "ಇಂದಿನ ೭ ತಿಂಡಿಗಳ ಆಯ್ಕೆಗಳು",
    poolSub: "ಪ್ರತಿದಿನವೂ ೭ ಸಾಂಪ್ರದಾಯಿಕ ಹಾಗೂ ರುಚಿಕರ ಆಯ್ಕೆಗಳ ಸಂಗ್ರಹ",
    dishesCount: "೭ ತಿಂಡಿಗಳು",
    quickView: "ವಿವರ ನೋಡಿ →",
    makePick: "ಇದನ್ನೇ ಇಂದಿನ ತಿಂಡಿ ಮಾಡಿ",
    batterHeroTitle: "ಸಂಜೆಯ ಹಿಟ್ಟಿನ ನೆನಪೋಲೆ (೭:೦೦ ಗಂಟೆಗೆ)",
    batterHeroDesc: "ಇಡ್ಲಿ, ದೋಸೆ ಮತ್ತು ವಡೆಗೆ ಹಿಂದಿನ ದಿನ ಸಂಜೆಯೇ ಹಿಟ್ಟು ಸಿದ್ಧಪಡಿಸಬೇಕು! ನಾಳಿನ ಉಪಾಹಾರಕ್ಕಾಗಿ ಇಂದೇ ನೆನೆಸಿಡಿ.",
    batterToggleTitle: "ಇಂದು ಸಂಜೆ ಹಿಟ್ಟು ಸಿದ್ಧಪಡಿಸಿದ್ದೀರಾ?",
    batterToggleDesc: "ಹಿಟ್ಟು ಸಿದ್ಧವಿದ್ದರೆ ದೋಸೆ/ಇಡ್ಲಿ ಆಯ್ಕೆಗಳು ಬರುತ್ತವೆ. ಇಲ್ಲದಿದ್ದರೆ ಕ್ಷಣಾರ್ಧದ (ಇನ್‌ಸ್ಟಂಟ್) ತಿಂಡಿಗಳನ್ನು ಸೂಚಿಸಲಾಗುತ್ತದೆ.",
    fridgeToggleTitle: "ಫ್ರಿಜ್‌ನಲ್ಲಿ ಉಳಿದ ಹಿಟ್ಟು ಇದೆಯೇ?",
    fridgeToggleDesc: "ಒಮ್ಮೆ ರುಬ್ಬಿದ ಇಡ್ಲಿ/ದೋಸೆ ಹಿಟ್ಟು ಫ್ರಿಜ್‌ನಲ್ಲಿ ೨-೩ ದಿನ ತಾಜಾವಾಗಿರುತ್ತದೆ.",
    batterTableTitle: "ಹಿಟ್ಟು ತಯಾರಿಕೆ ಮತ್ತು ನೆನೆಸುವ ಮಾರ್ಗದರ್ಶಿ",
    batterTableSub: "ಸರಿಯಾದ ಪ್ರಮಾಣ, ನೆನೆಸುವ ಸಮಯ ಮತ್ತು ಹುದುಗಿಸುವ ಸುಲಭ ವಿಧಾನಗಳು",
    groceryTitle: "ವಾರದ ದಿನಸಿ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ",
    grocerySub: "ವಾರದ ಎಲ್ಲಾ ದಿನಗಳ ಉಪಾಹಾರಕ್ಕೆ ಬೇಕಾಗುವ ಅಗತ್ಯ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ",
    resetGrocery: "ಮರುಹೊಂದಿಸಿ",
    filterTitle: "ಸ್ಮಾರ್ಟ್ ಶೋಧಕಗಳು",
    filterLateTitle: "\"ನನಗೆ ತಡವಾಗಿದೆ\" ಮೋಡ್ (≤ ೨೦ ನಿಮಿಷ)",
    filterLateSub: "ಅವಲಕ್ಕಿ, ಉಪ್ಪಿಟ್ಟು, ರವಾ ಇಡ್ಲಿಯಂತಹ ವೇಗದ ತಿಂಡಿಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಿ",
    filterVegTitle: "ಇಂದು ಸಸ್ಯಾಹಾರಿ ಮಾತ್ರ",
    filterVegSub: "ಇಂದಿನ ಆಯ್ಕೆಗಳಿಂದ ಮೊಟ್ಟೆಯ ತಿಂಡಿಗಳನ್ನು ಹೊರಗಿಡಿ",
    shareTitle: "ಇಂದಿನ ತಿಂಡಿ ಹಂಚಿಕೊಳ್ಳಿ",
    shareSub: "ಇಂದು ಮನೆಯಲ್ಲಿ ಏನು ತಿಂಡಿ ಎಂದು ನಿಮ್ಮ ಕುಟುಂಬ ಅಥವಾ ಸ್ನೇಹಿತರಿಗೆ ತಿಳಿಸಿ!",
    shareBtn: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ",
    aboutTitle: "\"ಇಂದು ತಿಂಡಿ ಏನು?\" ಬಗ್ಗೆ",
    toastPicked: "ಇಂದಿನ ತಿಂಡಿ ಆಯ್ಕೆಯಾಗಿದೆ: ",
    toastCopied: "ವಾಟ್ಸಾಪ್‌ಗೆ ತೆರೆಯಲಾಗಿದೆ!",
    eggBadge: "🥚 ಮೊಟ್ಟೆ",
    mandyaBadge: "⭐ ಮಂಡ್ಯ ವಿಶೇಷ",
    batterBadge: "🧂 ಹಿಟ್ಟು ಬೇಕು",
    instantBadge: "⚡ ತಕ್ಷಣ ತಯಾರಿ",
    viewDay: "ಇಂದಿನ ಪುಟದಲ್ಲಿ ನೋಡಿ →"
  }
};

// ==========================================================================
// Helpers
// ==========================================================================
function getActualCurrentDay() {
  return DAYS_OF_WEEK[new Date().getDay()];
}

function t(key) {
  return (I18N[state.currentLang] || I18N.en)[key] || I18N.en[key] || key;
}

function getVisual(dishId) {
  return DISH_VISUALS[dishId] || { emoji: "🍽️", from: "#E65100", to: "#FFB74D", accent: "#BF360C" };
}

// ==========================================================================
// DOM References
// ==========================================================================
const elements = {
  brandTitle: document.getElementById("brand-title-text"),
  brandSub: document.getElementById("brand-sub-text"),
  langToggleBtn: document.getElementById("lang-toggle-btn"),
  langBtnLabel: document.getElementById("lang-btn-label"),
  tabContents: document.querySelectorAll(".tab-content"),
  desktopNavBtns: document.querySelectorAll(".nav-btn-desktop"),
  mobileNavBtns: document.querySelectorAll(".mobile-nav-item"),
  daysScrollContainer: document.getElementById("days-scroll-container"),
  jumpToActualTodayBtn: document.getElementById("jump-to-actual-today-btn"),
  resetTodayLabel: document.getElementById("reset-today-label"),
  scheduleTitleText: document.getElementById("schedule-title-text"),

  // Hero Card
  heroBannerText: document.getElementById("hero-banner-text"),
  heroCategoryBadge: document.getElementById("hero-category-badge"),
  heroVisualSection: document.getElementById("hero-visual-section"),
  heroVisualBgGradient: document.getElementById("hero-visual-bg-gradient"),
  heroBadgesContainer: document.getElementById("hero-badges-container"),
  heroPlate: document.getElementById("hero-plate"),
  heroPlateGradient: document.getElementById("hero-plate-gradient"),
  heroPlateEmoji: document.getElementById("hero-plate-emoji"),
  heroDishTitle: document.getElementById("hero-dish-title"),
  heroDishKn: document.getElementById("hero-dish-kn"),
  heroDishTagline: document.getElementById("hero-dish-tagline"),
  heroMetricTime: document.getElementById("hero-metric-time"),
  heroMetricCals: document.getElementById("hero-metric-cals"),
  heroMetricProtein: document.getElementById("hero-metric-protein"),
  heroSidesLabel: document.getElementById("hero-sides-label"),
  heroSidesContainer: document.getElementById("hero-sides-container"),
  spinHeroBtn: document.getElementById("spin-hero-btn"),
  rerollBtn: document.getElementById("reroll-btn"),
  viewRecipeHeroBtn: document.getElementById("view-recipe-hero-btn"),
  spinBtnLabel: document.getElementById("spin-btn-label"),
  rerollBtnLabel: document.getElementById("reroll-btn-label"),
  recipeBtnLabel: document.getElementById("recipe-btn-label"),

  // Wheel
  wheelTitle: document.getElementById("wheel-title"),
  wheelSub: document.getElementById("wheel-sub"),
  wheelCanvas: document.getElementById("wheel-canvas"),
  spinWheelTriggerBtn: document.getElementById("spin-wheel-trigger-btn"),
  spinWheelActionText: document.getElementById("spin-wheel-action-text"),

  // Pool
  poolSectionTitle: document.getElementById("pool-section-title"),
  poolSectionSub: document.getElementById("pool-section-sub"),
  poolCountLabel: document.getElementById("pool-count-label"),
  dishesGridContainer: document.getElementById("dishes-grid-container"),

  // Week Tab
  weekAccordionContainer: document.getElementById("week-accordion-container"),
  weekViewTitle: document.getElementById("week-view-title"),
  weekViewSub: document.getElementById("week-view-sub"),

  // Batter Tab
  batterTitle: document.getElementById("batter-title"),
  batterSub: document.getElementById("batter-sub"),
  batterToggleTitle: document.getElementById("batter-toggle-title"),
  batterToggleDesc: document.getElementById("batter-toggle-desc"),
  fridgeToggleTitle: document.getElementById("fridge-toggle-title"),
  fridgeToggleDesc: document.getElementById("fridge-toggle-desc"),
  batterPrepTableTitle: document.getElementById("batter-prep-table-title"),
  batterPrepTableSub: document.getElementById("batter-prep-table-sub"),
  batterCardsContainer: document.getElementById("batter-cards-container"),
  batterReadyToggle: document.getElementById("batter-ready-toggle"),
  batterFridgeToggle: document.getElementById("batter-fridge-toggle"),

  // Grocery Tab
  groceryTitle: document.getElementById("grocery-title"),
  grocerySub: document.getElementById("grocery-sub"),
  groceryCategoriesContainer: document.getElementById("grocery-categories-container"),
  resetGroceryBtn: document.getElementById("reset-grocery-btn"),
  resetGroceryLabel: document.getElementById("reset-grocery-label"),

  // More Tab
  moreFiltersTitle: document.getElementById("more-filters-title"),
  filterLateTitle: document.getElementById("filter-late-title"),
  filterLateSub: document.getElementById("filter-late-sub"),
  filterVegTitle: document.getElementById("filter-veg-title"),
  filterVegSub: document.getElementById("filter-veg-sub"),
  filterLateToggle: document.getElementById("filter-late-toggle"),
  filterVegToggle: document.getElementById("filter-veg-toggle"),
  moreShareTitle: document.getElementById("more-share-title"),
  moreShareSub: document.getElementById("more-share-sub"),
  shareWhatsappBtn: document.getElementById("share-whatsapp-btn"),
  shareBtnLabel: document.getElementById("share-btn-label"),
  moreAboutTitle: document.getElementById("more-about-title"),

  // Dish Detail Modal
  dishModal: document.getElementById("dish-modal"),
  modalCloseBtn: document.getElementById("modal-close-btn"),
  modalVisualHeader: document.getElementById("modal-visual-header"),
  modalVisualBg: document.getElementById("modal-visual-bg"),
  modalPlate: document.getElementById("modal-plate"),
  modalPlateGradient: document.getElementById("modal-plate-gradient"),
  modalPlateEmoji: document.getElementById("modal-plate-emoji"),
  modalDishTitle: document.getElementById("modal-dish-title"),
  modalDishKn: document.getElementById("modal-dish-kn"),
  modalCategoryBadge: document.getElementById("modal-category-badge"),
  modalDishTagline: document.getElementById("modal-dish-tagline"),
  modalMetricTime: document.getElementById("modal-metric-time"),
  modalMetricCals: document.getElementById("modal-metric-cals"),
  modalMetricProtein: document.getElementById("modal-metric-protein"),
  modalSidesLabel: document.getElementById("modal-sides-label"),
  modalSidesContainer: document.getElementById("modal-sides-container"),
  modalIngredientsLabel: document.getElementById("modal-ingredients-label"),
  modalIngredientsContainer: document.getElementById("modal-ingredients-container"),
  modalRecipeLabel: document.getElementById("modal-recipe-label"),
  modalStepsContainer: document.getElementById("modal-steps-container"),
  modalSelectTodayBtn: document.getElementById("modal-select-today-btn"),
  modalSelectBtnText: document.getElementById("modal-select-btn-text"),

  // Toast
  toastNotice: document.getElementById("toast-notice")
};

// ==========================================================================
// Initialization
// ==========================================================================
function initApp() {
  setupLanguage();
  setupNavigation();
  renderDaysPillList();
  renderCurrentDayDishes();
  renderWeekView();
  renderBatterGuide();
  renderGroceryList();
  setupEventListeners();
  drawWheel();
}

// ==========================================================================
// Navigation
// ==========================================================================
function setupNavigation() {
  const switchTab = (tabName) => {
    state.activeTab = tabName;
    elements.tabContents.forEach(tab => tab.classList.toggle("active", tab.id === `tab-${tabName}`));
    elements.desktopNavBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tabName));
    elements.mobileNavBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tabName));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  elements.desktopNavBtns.forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
  elements.mobileNavBtns.forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
}

// ==========================================================================
// Language Toggle
// ==========================================================================
function setupLanguage() {
  updateLanguageUI();

  elements.langToggleBtn.addEventListener("click", () => {
    state.currentLang = state.currentLang === "en" ? "kn" : "en";
    localStorage.setItem("indu_lang", state.currentLang);
    updateLanguageUI();
    renderDaysPillList();
    renderCurrentDayDishes();
    renderWeekView();
    renderBatterGuide();
    renderGroceryList();
    drawWheel();
  });
}

function updateLanguageUI() {
  const isKn = state.currentLang === "kn";
  document.documentElement.lang = isKn ? "kn" : "en";

  elements.brandTitle.textContent = t("appTitle");
  elements.brandSub.textContent = t("appSubtitle");
  elements.langBtnLabel.textContent = t("langBtn");

  document.querySelectorAll(".nav-label").forEach(el => {
    el.textContent = isKn ? el.getAttribute("data-kn") : el.getAttribute("data-en");
  });

  elements.scheduleTitleText.textContent = isKn ? "ಇಂದಿನ ತಿಂಡಿ ವರ್ಗ ಮತ್ತು ವೇಳಾಪಟ್ಟಿ" : "Today's Category & Schedule";
  elements.resetTodayLabel.textContent = isKn ? "ಇಂದು" : "Today";
  elements.heroBannerText.textContent = t("recommendationTitle");
  elements.heroSidesLabel.textContent = t("servedWith");
  elements.spinBtnLabel.textContent = t("spinBreakfastBtn");
  elements.rerollBtnLabel.textContent = t("rerollBtn");
  elements.recipeBtnLabel.textContent = t("recipeBtn");
  elements.wheelTitle.textContent = t("spinTitle");
  elements.wheelSub.textContent = t("spinSub");
  elements.spinWheelActionText.textContent = t("spinActionText");
  elements.poolSectionTitle.textContent = t("poolTitle");
  elements.poolSectionSub.textContent = t("poolSub");
  elements.poolCountLabel.textContent = t("dishesCount");

  elements.batterTitle.textContent = t("batterHeroTitle");
  elements.batterSub.textContent = t("batterHeroDesc");
  elements.batterToggleTitle.textContent = t("batterToggleTitle");
  elements.batterToggleDesc.textContent = t("batterToggleDesc");
  elements.fridgeToggleTitle.textContent = t("fridgeToggleTitle");
  elements.fridgeToggleDesc.textContent = t("fridgeToggleDesc");
  elements.batterPrepTableTitle.textContent = t("batterTableTitle");
  elements.batterPrepTableSub.textContent = t("batterTableSub");

  elements.groceryTitle.textContent = t("groceryTitle");
  elements.grocerySub.textContent = t("grocerySub");
  elements.resetGroceryLabel.textContent = t("resetGrocery");

  elements.moreFiltersTitle.textContent = t("filterTitle");
  elements.filterLateTitle.textContent = t("filterLateTitle");
  elements.filterLateSub.textContent = t("filterLateSub");
  elements.filterVegTitle.textContent = t("filterVegTitle");
  elements.filterVegSub.textContent = t("filterVegSub");
  elements.moreShareTitle.textContent = t("shareTitle");
  elements.moreShareSub.textContent = t("shareSub");
  elements.shareBtnLabel.textContent = t("shareBtn");
  elements.moreAboutTitle.textContent = t("aboutTitle");

  elements.modalSidesLabel.textContent = t("servedWith");
  elements.modalIngredientsLabel.textContent = isKn ? "ಪ್ರಮುಖ ಸಾಮಗ್ರಿಗಳು" : "Key Ingredients";
  elements.modalRecipeLabel.textContent = isKn ? "ಮಾಡುವ ಸುಲಭ ವಿಧಾನ (ರೆಸಿಪಿ)" : "How to make it (Short Recipe)";
  elements.modalSelectBtnText.textContent = t("makePick");
}

// ==========================================================================
// Days Scroll Bar
// ==========================================================================
function renderDaysPillList() {
  const container = elements.daysScrollContainer;
  container.innerHTML = "";
  const actualToday = getActualCurrentDay();
  const isKn = state.currentLang === "kn";

  DAYS_OF_WEEK.forEach(dayKey => {
    const dayData = WEEK_DATA[dayKey];
    const btn = document.createElement("button");
    btn.className = `day-pill-btn ${dayKey === state.selectedDay ? "active" : ""}`;
    btn.dataset.day = dayKey;
    const isToday = dayKey === actualToday;
    const nameStr = isKn ? dayData.dayName_kn : dayData.dayName;

    btn.innerHTML = `
      <span class="day-pill-name">${nameStr}${isToday ? " •" : ""}</span>
      <span class="day-pill-badge">${dayData.categoryIcon} ${(isKn ? dayData.categoryLabel_kn : dayData.categoryLabel).split(" ")[0]}</span>
    `;

    btn.addEventListener("click", () => {
      state.selectedDay = dayKey;
      renderDaysPillList();
      renderCurrentDayDishes();
      drawWheel();
    });

    container.appendChild(btn);
  });
}

// ==========================================================================
// Dish Filtering (Batter, Late mode, Veg-only)
// ==========================================================================
function getEligibleDishesForDay(dayKey) {
  const dayData = WEEK_DATA[dayKey];
  let dishList = dayData.dishIds.map(id => DISHES[id]).filter(Boolean);

  if (state.filterLate) {
    dishList = dishList.filter(d => d.timeMins <= 20);
  }
  if (state.filterVegOnly) {
    dishList = dishList.filter(d => !d.isEgg);
  }
  if (!state.batterReady && !state.batterInFridge) {
    const instant = dishList.filter(d => !d.needsBatter || d.batterType === "instant");
    if (instant.length > 0) dishList = instant;
  }
  if (dishList.length === 0) {
    dishList = dayData.dishIds.map(id => DISHES[id]);
  }
  return dishList;
}

// ==========================================================================
// Render Today's Dishes (Grid + Hero)
// ==========================================================================
function renderCurrentDayDishes() {
  const dayData = WEEK_DATA[state.selectedDay];
  const eligible = getEligibleDishesForDay(state.selectedDay);
  const isKn = state.currentLang === "kn";

  if (!state.currentFeaturedDishId || !eligible.some(d => d.id === state.currentFeaturedDishId)) {
    state.currentFeaturedDishId = eligible[0].id;
  }

  const featured = DISHES[state.currentFeaturedDishId];
  updateFeaturedHeroCard(featured, dayData);

  // Render 7-dish grid
  const grid = elements.dishesGridContainer;
  grid.innerHTML = "";

  dayData.dishIds.forEach((dishId, index) => {
    const dish = DISHES[dishId];
    if (!dish) return;

    const visual = getVisual(dishId);
    const isFeatured = dish.id === state.currentFeaturedDishId;
    const card = document.createElement("div");
    card.className = `dish-card ${isFeatured ? "is-featured" : ""}`;

    // Badges
    let badgesHtml = "";
    if (dish.isMandya) badgesHtml += `<span class="badge-special badge-mandya">${t("mandyaBadge")}</span>`;
    if (dish.isEgg) badgesHtml += `<span class="badge-special badge-egg">${t("eggBadge")}</span>`;
    if (dish.needsBatter) badgesHtml += `<span class="badge-special badge-batter">${t("batterBadge")}</span>`;
    else if (dish.batterType === "instant") badgesHtml += `<span class="badge-special" style="background:linear-gradient(135deg,#E8F5E9,#C8E6C9); color:#2E7D32; border:1px solid #A5D6A7;">${t("instantBadge")}</span>`;

    card.innerHTML = `
      <div class="card-visual-header" style="--card-accent: ${visual.from};">
        <div class="dish-visual-plate size-card" style="background: radial-gradient(circle at 35% 30%, #F5E6C8 0%, #C8A76C 40%, #A68940 70%, #8B6914 100%);">
          <div class="plate-food-gradient" style="background: radial-gradient(circle at 45% 40%, ${visual.from}44, ${visual.to}66);"></div>
          <span class="plate-emoji">${visual.emoji}</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div class="card-top-meta">
            <h4 class="dish-card-name">${dish.name}</h4>
            <span class="card-number">${index + 1}</span>
          </div>
          <div class="dish-card-kn">${dish.name_kn}</div>
        </div>
      </div>

      <div class="card-info-body">
        <div class="card-badges" style="margin-bottom: 8px;">${badgesHtml}</div>
        <div class="dish-card-sides">
          <strong>${isKn ? "ನೆಂಜಿಕೆಗಳು: " : "Sides: "}</strong>${dish.sides.join(", ")}
        </div>
        <div class="card-footer-row">
          <span>⏱️ ${dish.timeMins}m · 🔥 ${dish.calories} kcal · 💪 ${dish.protein}g</span>
          <button class="card-quick-view-btn" data-dish="${dish.id}">
            ${t("quickView")}
          </button>
        </div>
      </div>
    `;

    // Colorful top accent line
    const headerEl = card.querySelector('.card-visual-header');
    if (headerEl) {
      headerEl.style.setProperty('--card-accent', visual.from);
      headerEl.insertAdjacentHTML('afterbegin',
        `<div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${visual.from},${visual.to});border-radius:${isFeatured ? '14px' : '16px'} ${isFeatured ? '14px' : '16px'} 0 0;"></div>`
      );
    }

    card.addEventListener("click", () => openDishModal(dish));
    grid.appendChild(card);
  });
}

// ==========================================================================
// Update Hero Card (Brass Plate Visual)
// ==========================================================================
function updateFeaturedHeroCard(dish, dayData) {
  const isKn = state.currentLang === "kn";
  const visual = getVisual(dish.id);

  // Category badge
  elements.heroCategoryBadge.className = `category-badge ${dayData.category}`;
  elements.heroCategoryBadge.textContent = `${dayData.categoryIcon} ${isKn ? dayData.categoryLabel_kn : dayData.categoryLabel}`;

  // Dish info text
  elements.heroDishTitle.textContent = dish.name;
  elements.heroDishKn.textContent = dish.name_kn;
  elements.heroDishTagline.textContent = dish.tagline;
  elements.heroMetricTime.textContent = `${dish.timeMins} ${isKn ? "ನಿಮಿಷ" : "mins"}`;
  elements.heroMetricCals.textContent = `${dish.calories} kcal`;
  elements.heroMetricProtein.textContent = `${dish.protein}g ${isKn ? "ಪ್ರೋಟೀನ್" : "protein"}`;

  // Brass plate visual - food gradient + emoji
  elements.heroPlateEmoji.textContent = visual.emoji;
  elements.heroPlateGradient.style.background = `radial-gradient(circle at 45% 40%, ${visual.from}55, ${visual.to}77)`;

  // Background gradient behind plate
  elements.heroVisualBgGradient.style.background = `radial-gradient(circle at 50% 50%, ${visual.from}, ${visual.to}, transparent 70%)`;

  // Badges
  const badges = elements.heroBadgesContainer;
  badges.innerHTML = "";
  if (dish.isMandya) badges.innerHTML += `<span class="badge-special badge-mandya">${t("mandyaBadge")}</span>`;
  if (dish.isEgg) badges.innerHTML += `<span class="badge-special badge-egg">${t("eggBadge")}</span>`;
  if (dish.needsBatter) badges.innerHTML += `<span class="badge-special badge-batter">${t("batterBadge")}</span>`;

  // Sides tags
  const sides = elements.heroSidesContainer;
  sides.innerHTML = "";
  dish.sides.forEach(s => {
    const tag = document.createElement("span");
    tag.className = "side-tag";
    tag.textContent = s;
    sides.appendChild(tag);
  });
}

// ==========================================================================
// Spin Wheel (Canvas)
// ==========================================================================
const WHEEL_COLORS = [
  "#D84315", "#2E7D32", "#F9A825", "#A1543A",
  "#EA580C", "#1B5E20", "#C05621"
];

function drawWheel() {
  const canvas = elements.wheelCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const r = w / 2;
  const dishes = getEligibleDishesForDay(state.selectedDay);
  const n = dishes.length;
  const slice = (2 * Math.PI) / n;

  ctx.clearRect(0, 0, w, h);

  dishes.forEach((dish, i) => {
    const angle = i * slice;
    const visual = getVisual(dish.id);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r - 8, angle, angle + slice);
    ctx.closePath();

    // Gradient fill per slice
    const grad = ctx.createRadialGradient(r, r, 20, r, r, r - 8);
    grad.addColorStop(0, visual.to);
    grad.addColorStop(1, visual.from || WHEEL_COLORS[i % WHEEL_COLORS.length]);
    ctx.fillStyle = grad;
    ctx.fill();

    // Slice border
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    // Emoji & Text inside slice
    ctx.translate(r, r);
    ctx.rotate(angle + slice / 2);

    // Emoji
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(visual.emoji, r * 0.55, 3);

    // Name
    ctx.textAlign = "right";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 11px -apple-system, sans-serif";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 4;
    const name = state.currentLang === "kn" ? dish.name_kn : dish.name;
    ctx.fillText(name.length > 13 ? name.substring(0, 11) + "…" : name, r - 14, -8);

    ctx.restore();
  });

  // Center cap shadow ring
  ctx.beginPath();
  ctx.arc(r, r, 32, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fill();
}

function spinWheel() {
  if (state.isSpinning) return;
  state.isSpinning = true;
  elements.spinWheelTriggerBtn.disabled = true;
  elements.spinHeroBtn.disabled = true;

  const dishes = getEligibleDishesForDay(state.selectedDay);
  const n = dishes.length;
  const sliceAngle = 360 / n;
  const winnerIdx = Math.floor(Math.random() * n);
  const winner = dishes[winnerIdx];
  const fullRots = 5 + Math.floor(Math.random() * 3);
  const targetCenter = (winnerIdx * sliceAngle) + (sliceAngle / 2);
  const targetAngle = (fullRots * 360) + (270 - targetCenter);

  state.wheelAngle += targetAngle;
  elements.wheelCanvas.style.transform = `rotate(${state.wheelAngle}deg)`;

  setTimeout(() => {
    state.isSpinning = false;
    elements.spinWheelTriggerBtn.disabled = false;
    elements.spinHeroBtn.disabled = false;

    state.currentFeaturedDishId = winner.id;
    renderCurrentDayDishes();
    showToast(`${t("toastPicked")} ${state.currentLang === "kn" ? winner.name_kn : winner.name}! 🍛`);
    document.getElementById("featured-hero-card").scrollIntoView({ behavior: "smooth", block: "center" });
  }, 4000);
}

// ==========================================================================
// Reroll
// ==========================================================================
function rerollDish() {
  const eligible = getEligibleDishesForDay(state.selectedDay);
  if (eligible.length <= 1) return;
  const others = eligible.filter(d => d.id !== state.currentFeaturedDishId);
  const pick = others[Math.floor(Math.random() * others.length)];
  state.currentFeaturedDishId = pick.id;
  renderCurrentDayDishes();
  showToast(`${t("toastPicked")} ${state.currentLang === "kn" ? pick.name_kn : pick.name}`);
}

// ==========================================================================
// Week Tab View
// ==========================================================================
function renderWeekView() {
  const container = elements.weekAccordionContainer;
  container.innerHTML = "";
  const isKn = state.currentLang === "kn";
  const actualToday = getActualCurrentDay();

  DAYS_OF_WEEK.forEach(dayKey => {
    const dayData = WEEK_DATA[dayKey];
    const card = document.createElement("div");
    card.className = "week-day-accordion";
    const isToday = dayKey === actualToday;

    let dishesHtml = dayData.dishIds.map((id, idx) => {
      const d = DISHES[id];
      if (!d) return "";
      const v = getVisual(id);
      const star = d.isMandya ? " ⭐" : "";
      const egg = d.isEgg ? " 🥚" : "";
      const batter = d.needsBatter ? " 🧂" : "";
      return `
        <div class="accordion-dish-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.3rem;">${v.emoji}</span>
            <div>
              <span style="font-weight:700; color:var(--text-muted); margin-right:4px; font-size:0.78rem;">${idx+1}.</span>
              <strong style="font-size:0.88rem;">${isKn ? d.name_kn : d.name}</strong>${star}${egg}${batter}
            </div>
          </div>
          <span style="font-size:0.76rem; color:var(--text-secondary); max-width:140px; text-align:right;">${d.sides.slice(0,2).join(", ")}</span>
        </div>
      `;
    }).join("");

    card.innerHTML = `
      <div class="accordion-header ${isToday ? "is-open" : ""}" data-day="${dayKey}">
        <div class="accordion-day-title">
          <span style="font-size:1.4rem;">${dayData.categoryIcon}</span>
          <div>
            <div class="accordion-day-name">
              ${isKn ? dayData.dayName_kn : dayData.dayName}
              ${isToday ? `<span class="badge-special badge-mandya" style="font-size:0.68rem; margin-left:6px;">${isKn ? "ಇಂದು" : "Today"}</span>` : ""}
            </div>
            <div class="accordion-day-kn">${isKn ? dayData.categoryLabel_kn : dayData.categoryLabel}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="category-badge ${dayData.category}">${dayData.category}</span>
          <span class="accordion-toggle-arrow" style="font-size:0.8rem; color:var(--text-muted);">▼</span>
        </div>
      </div>
      <div class="accordion-content ${isToday ? "is-open" : ""}">
        <div style="margin-bottom:12px;">${dishesHtml}</div>
        <button class="btn-secondary jump-to-day-btn" data-day="${dayKey}" style="width:100%; font-size:0.82rem; padding:8px 12px; min-height:38px;">
          ${t("viewDay")}
        </button>
      </div>
    `;

    const header = card.querySelector(".accordion-header");
    const content = card.querySelector(".accordion-content");
    const arrow = card.querySelector(".accordion-toggle-arrow");

    header.addEventListener("click", () => {
      const isOpen = content.classList.contains("is-open");
      content.classList.toggle("is-open", !isOpen);
      header.classList.toggle("is-open", !isOpen);
      arrow.textContent = isOpen ? "▼" : "▲";
    });

    card.querySelector(".jump-to-day-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      state.selectedDay = dayKey;
      renderDaysPillList();
      renderCurrentDayDishes();
      drawWheel();
      elements.desktopNavBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === "today"));
      elements.mobileNavBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === "today"));
      elements.tabContents.forEach(t => t.classList.toggle("active", t.id === "tab-today"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    container.appendChild(card);
  });
}

// ==========================================================================
// Batter Guide
// ==========================================================================
function renderBatterGuide() {
  const container = elements.batterCardsContainer;
  container.innerHTML = "";
  const isKn = state.currentLang === "kn";

  Object.entries(BATTER_GUIDE).forEach(([key, guide]) => {
    const card = document.createElement("div");
    card.className = "batter-guide-card";

    card.innerHTML = `
      <div class="batter-guide-card-title">
        <span>${isKn ? guide.title_kn : guide.title}</span>
        <span class="batter-time-pill">${guide.badge}</span>
      </div>
      <div style="font-size:0.78rem; color:var(--terracotta); margin-bottom:8px;">
        <strong>${isKn ? "ಬಳಸುವ ತಿಂಡಿಗಳು: " : "Used for: "}</strong>${guide.dishes.join(", ")}
      </div>
      <div style="font-size:0.8rem; margin-bottom:8px;">
        ⏱️ <strong>${isKn ? "ನೆನೆಸುವಿಕೆ: " : "Soak: "}</strong>${guide.soakHours} ·
        🍶 <strong>${isKn ? "ಹುದುಗುವಿಕೆ: " : "Ferment: "}</strong>${guide.fermentHours}
      </div>
      <p style="font-size:0.84rem; color:var(--text-secondary); line-height:1.45; margin-bottom:8px;">
        ${guide.prepTonight}
      </p>
      <div style="font-size:0.76rem; background:linear-gradient(135deg, var(--bg-cream), var(--bg-warm)); padding:8px 10px; border-radius:var(--radius-sm); color:var(--text-primary); border:1px solid var(--border-subtle);">
        💡 <em>${guide.tips}</em>
      </div>
    `;

    container.appendChild(card);
  });
}

// ==========================================================================
// Grocery List
// ==========================================================================
function renderGroceryList() {
  const container = elements.groceryCategoriesContainer;
  container.innerHTML = "";
  const isKn = state.currentLang === "kn";

  GROCERY_CATEGORIES.forEach((catGroup, catIdx) => {
    const card = document.createElement("div");
    card.className = "grocery-category-card";

    let itemsHtml = catGroup.items.map((item, itemIdx) => {
      const key = `item_${catIdx}_${itemIdx}`;
      const checked = !!state.groceryCheckedState[key];
      const name = isKn ? `${item.name_kn} (${item.name})` : item.name;
      return `
        <label class="grocery-item-row ${checked ? "is-done" : ""}" data-key="${key}">
          <input type="checkbox" ${checked ? "checked" : ""}>
          <span>${name}</span>
        </label>
      `;
    }).join("");

    card.innerHTML = `
      <div class="grocery-cat-header">
        <span>${catGroup.icon}</span>
        <span>${isKn ? catGroup.category_kn : catGroup.category}</span>
      </div>
      <div class="grocery-checklist">${itemsHtml}</div>
    `;

    card.querySelectorAll(".grocery-item-row").forEach(row => {
      const cb = row.querySelector("input[type='checkbox']");
      cb.addEventListener("change", () => {
        state.groceryCheckedState[row.dataset.key] = cb.checked;
        localStorage.setItem("indu_grocery_checked", JSON.stringify(state.groceryCheckedState));
        row.classList.toggle("is-done", cb.checked);
      });
    });

    container.appendChild(card);
  });
}

// ==========================================================================
// Dish Detail Modal (gradient + brass plate visual)
// ==========================================================================
function openDishModal(dish) {
  const isKn = state.currentLang === "kn";
  const visual = getVisual(dish.id);

  // Set gradient visual header background
  elements.modalVisualBg.style.background = `linear-gradient(145deg, ${visual.from}, ${visual.to})`;

  // Brass plate visual
  elements.modalPlateEmoji.textContent = visual.emoji;
  elements.modalPlateGradient.style.background = `radial-gradient(circle at 45% 40%, ${visual.from}55, ${visual.to}77)`;

  // Text content
  elements.modalDishTitle.textContent = dish.name;
  elements.modalDishKn.textContent = dish.name_kn;
  elements.modalDishTagline.textContent = dish.tagline;
  elements.modalCategoryBadge.className = `category-badge ${dish.category}`;
  elements.modalCategoryBadge.textContent = dish.category.toUpperCase();

  elements.modalMetricTime.textContent = `${dish.timeMins} ${isKn ? "ನಿಮಿಷ" : "mins"}`;
  elements.modalMetricCals.textContent = `${dish.calories} kcal`;
  elements.modalMetricProtein.textContent = `${dish.protein}g ${isKn ? "ಪ್ರೋಟೀನ್" : "protein"}`;

  // Sides
  elements.modalSidesContainer.innerHTML = "";
  dish.sides.forEach(s => {
    const tag = document.createElement("span");
    tag.className = "side-tag";
    tag.textContent = s;
    elements.modalSidesContainer.appendChild(tag);
  });

  // Ingredients
  elements.modalIngredientsContainer.innerHTML = "";
  dish.ingredients.forEach(ing => {
    const pill = document.createElement("span");
    pill.className = "modal-ingredient-pill";
    pill.textContent = ing;
    elements.modalIngredientsContainer.appendChild(pill);
  });

  // Recipe Steps
  elements.modalStepsContainer.innerHTML = "";
  dish.recipeSteps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    elements.modalStepsContainer.appendChild(li);
  });

  // "Make this today's pick" button
  elements.modalSelectTodayBtn.onclick = () => {
    state.currentFeaturedDishId = dish.id;
    renderCurrentDayDishes();
    closeDishModal();
    showToast(`${t("toastPicked")} ${isKn ? dish.name_kn : dish.name}`);
    document.getElementById("featured-hero-card").scrollIntoView({ behavior: "smooth" });
  };

  elements.dishModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDishModal() {
  elements.dishModal.classList.remove("active");
  document.body.style.overflow = "";
}

// ==========================================================================
// Toast
// ==========================================================================
let toastTimer = null;
function showToast(msg) {
  const toast = elements.toastNotice;
  toast.textContent = msg;
  toast.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.style.display = "none"; }, 3200);
}

// ==========================================================================
// Global Event Listeners
// ==========================================================================
function setupEventListeners() {
  elements.jumpToActualTodayBtn.addEventListener("click", () => {
    state.selectedDay = getActualCurrentDay();
    renderDaysPillList();
    renderCurrentDayDishes();
    drawWheel();
  });

  elements.spinHeroBtn.addEventListener("click", () => {
    document.getElementById("wheel-section").scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(spinWheel, 400);
  });

  elements.rerollBtn.addEventListener("click", rerollDish);

  elements.viewRecipeHeroBtn.addEventListener("click", () => {
    const dish = DISHES[state.currentFeaturedDishId];
    if (dish) openDishModal(dish);
  });

  elements.spinWheelTriggerBtn.addEventListener("click", spinWheel);

  // Modal close
  elements.modalCloseBtn.addEventListener("click", closeDishModal);
  elements.dishModal.addEventListener("click", e => { if (e.target === elements.dishModal) closeDishModal(); });
  window.addEventListener("keydown", e => { if (e.key === "Escape" && elements.dishModal.classList.contains("active")) closeDishModal(); });

  // Batter toggles
  elements.batterReadyToggle.checked = state.batterReady;
  elements.batterFridgeToggle.checked = state.batterInFridge;

  elements.batterReadyToggle.addEventListener("change", e => {
    state.batterReady = e.target.checked;
    localStorage.setItem("indu_batter_ready", state.batterReady);
    renderCurrentDayDishes();
    drawWheel();
  });

  elements.batterFridgeToggle.addEventListener("change", e => {
    state.batterInFridge = e.target.checked;
    localStorage.setItem("indu_batter_fridge", state.batterInFridge);
    renderCurrentDayDishes();
    drawWheel();
  });

  // Filters
  elements.filterLateToggle.addEventListener("change", e => {
    state.filterLate = e.target.checked;
    renderCurrentDayDishes();
    drawWheel();
  });

  elements.filterVegToggle.addEventListener("change", e => {
    state.filterVegOnly = e.target.checked;
    renderCurrentDayDishes();
    drawWheel();
  });

  // Reset grocery
  elements.resetGroceryBtn.addEventListener("click", () => {
    state.groceryCheckedState = {};
    localStorage.removeItem("indu_grocery_checked");
    renderGroceryList();
    showToast(state.currentLang === "kn" ? "ಪಟ್ಟಿ ಮರುಹೊಂದಿಸಲಾಗಿದೆ!" : "Grocery list reset!");
  });

  // WhatsApp share
  elements.shareWhatsappBtn.addEventListener("click", () => {
    const dish = DISHES[state.currentFeaturedDishId];
    if (!dish) return;
    const visual = getVisual(dish.id);
    const text = state.currentLang === "kn"
      ? `${visual.emoji} ಇಂದಿನ ತಿಂಡಿ: ${dish.name_kn} (${dish.name})!\nಜೊತೆಗೆ: ${dish.sides.join(", ")}.\n\n"ಇಂದು ತಿಂಡಿ ಏನು?" ಅಪ್ಲಿಕೇಶನ್ ಮೂಲಕ ಆಯ್ಕೆ.`
      : `${visual.emoji} Today's breakfast: ${dish.name} (${dish.name_kn})!\nServed with: ${dish.sides.join(", ")}.\n\nDecided via "Indu Tindi Enu?" App.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    showToast(t("toastCopied"));
  });
}

// ==========================================================================
// Start
// ==========================================================================
document.addEventListener("DOMContentLoaded", initApp);
