// Dish Visual Identity Map - emoji + gradient colors that match the actual food
// Each dish gets colors inspired by its real appearance

const DISH_VISUALS = {
  // --- SUNDAY (Rice) ---
  bisibele_bath:          { emoji: "🍛", from: "#E65100", to: "#FFB74D", accent: "#BF360C" },
  tomato_bath:            { emoji: "🍅", from: "#C62828", to: "#FF8A65", accent: "#B71C1C" },
  ven_pongal:             { emoji: "🍲", from: "#F9A825", to: "#FFF176", accent: "#F57F17" },
  chow_chow_bath:         { emoji: "🧁", from: "#FF8F00", to: "#F48FB1", accent: "#E65100" },
  avalakki_uppittu:       { emoji: "🥣", from: "#FFD54F", to: "#FFF8E1", accent: "#FF8F00" },
  shavige_bath:           { emoji: "🍜", from: "#D4A24C", to: "#F5E6C8", accent: "#A1887F" },
  boiled_egg_upma:        { emoji: "🍳", from: "#FFB300", to: "#FFF3E0", accent: "#FF6F00" },

  // --- MONDAY (Dosa) ---
  idli:                   { emoji: "☁️", from: "#ECEFF1", to: "#FAFAFA", accent: "#78909C" },
  plain_ghee_dosa:        { emoji: "🥞", from: "#E65100", to: "#FFCC80", accent: "#BF360C" },
  masala_dosa:            { emoji: "🥞", from: "#D84315", to: "#FFB74D", accent: "#BF360C" },
  rava_dosa:              { emoji: "🕸️", from: "#D4A24C", to: "#FFF8E1", accent: "#A1887F" },
  medu_vada:              { emoji: "🍩", from: "#BF360C", to: "#FFAB91", accent: "#8D3510" },
  onion_uttapam:          { emoji: "🧅", from: "#E65100", to: "#A5D6A7", accent: "#33691E" },
  pesarattu:              { emoji: "🌿", from: "#2E7D32", to: "#A5D6A7", accent: "#1B5E20" },

  // --- TUESDAY (Roti + Egg) ---
  akki_rotti:             { emoji: "🫓", from: "#8D6E63", to: "#D7CCC8", accent: "#5D4037" },
  chapati:                { emoji: "🫓", from: "#A1887F", to: "#EFEBE9", accent: "#6D4C41" },
  phulka:                 { emoji: "🎈", from: "#BCAAA4", to: "#FFF3E0", accent: "#795548" },
  puri:                   { emoji: "✨", from: "#FF8F00", to: "#FFE082", accent: "#E65100" },
  egg_bhurji_chapati:     { emoji: "🍳", from: "#EF6C00", to: "#FFE0B2", accent: "#E65100" },
  egg_bhurji_akki_rotti:  { emoji: "🍳", from: "#6D4C41", to: "#FFCC80", accent: "#4E342E" },
  egg_paratha:            { emoji: "🥚", from: "#BF360C", to: "#FFE0B2", accent: "#8D3510" },

  // --- WEDNESDAY (Dosa + Egg) ---
  egg_dosa:               { emoji: "🍳", from: "#E65100", to: "#FFE082", accent: "#BF360C" },
  masala_omelette_dosa:   { emoji: "🍳", from: "#FF6F00", to: "#FFECB3", accent: "#E65100" },
  set_dosa:               { emoji: "🥞", from: "#FFF3E0", to: "#FAFAFA", accent: "#BCAAA4" },
  neer_dosa:              { emoji: "💧", from: "#E3F2FD", to: "#FAFAFA", accent: "#90CAF9" },
  rava_idli:              { emoji: "⚪", from: "#FFF8E1", to: "#FFFDE7", accent: "#FFD54F" },
  maddur_vada:            { emoji: "🧅", from: "#BF360C", to: "#FFAB91", accent: "#8D3510" },
  ragi_dosa:              { emoji: "🌾", from: "#4E342E", to: "#A1887F", accent: "#3E2723" },

  // --- THURSDAY (Rice) ---
  vegetable_bath:         { emoji: "🥗", from: "#2E7D32", to: "#C8E6C9", accent: "#1B5E20" },
  vangi_bath:             { emoji: "🍆", from: "#6A1B9A", to: "#CE93D8", accent: "#4A148C" },
  chitranna:              { emoji: "🍋", from: "#F9A825", to: "#FFF9C4", accent: "#F57F17" },
  puliyogare:             { emoji: "🫕", from: "#8D6B2A", to: "#D4A24C", accent: "#5D4037" },
  upma:                   { emoji: "🥣", from: "#FFB300", to: "#FFF8E1", accent: "#FF8F00" },
  ven_pongal_thu:         { emoji: "🍲", from: "#F9A825", to: "#FFF176", accent: "#F57F17" },
  khara_bath:             { emoji: "🌶️", from: "#D84315", to: "#FFAB91", accent: "#BF360C" },

  // --- FRIDAY (Roti + Egg) ---
  ragi_rotti:             { emoji: "🫓", from: "#3E2723", to: "#8D6E63", accent: "#4E342E" },
  chapati_fri:            { emoji: "🫓", from: "#A1887F", to: "#EFEBE9", accent: "#6D4C41" },
  puri_fri:               { emoji: "✨", from: "#FF8F00", to: "#FFE082", accent: "#E65100" },
  phulka_fri:             { emoji: "🎈", from: "#BCAAA4", to: "#FFF3E0", accent: "#795548" },
  egg_curry_chapati:      { emoji: "🥘", from: "#B71C1C", to: "#EF9A9A", accent: "#C62828" },
  egg_masala_ragi_rotti:  { emoji: "🌶️", from: "#4E342E", to: "#EF5350", accent: "#3E2723" },
  egg_puri_bhaji:         { emoji: "🥚", from: "#E65100", to: "#FFE082", accent: "#BF360C" },

  // --- SATURDAY (Dosa) ---
  davangere_benne_dosa:   { emoji: "🧈", from: "#FF8F00", to: "#FFF8E1", accent: "#E65100" },
  thatte_idli:            { emoji: "🍽️", from: "#ECEFF1", to: "#FAFAFA", accent: "#90A4AE" },
  idli_vada_combo:        { emoji: "🏆", from: "#E65100", to: "#FFF3E0", accent: "#BF360C" },
  adai:                   { emoji: "🫘", from: "#8D3510", to: "#FFAB91", accent: "#6D2D10" },
  button_idli:            { emoji: "🔘", from: "#FFF3E0", to: "#FAFAFA", accent: "#FFB74D" },
  paddu:                  { emoji: "🟤", from: "#6D4C41", to: "#FFCC80", accent: "#4E342E" },
  tomato_uttapam:         { emoji: "🍅", from: "#C62828", to: "#FFCDD2", accent: "#B71C1C" }
};
