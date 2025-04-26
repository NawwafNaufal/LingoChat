/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Distance
 */
function levenshtein(a, b) {
  const alen = a.length;
  const blen = b.length;
  const arr = [];

  for (let i = 0; i <= alen; i++) arr[i] = [i];
  for (let j = 0; j <= blen; j++) arr[0][j] = j;

  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      arr[i][j] = Math.min(
        arr[i - 1][j] + 1,
        arr[i][j - 1] + 1,
        arr[i - 1][j - 1] + cost
      );
    }
  }

  return arr[alen][blen];
}

/**
 * Get correction candidates for a word
 * @param {string} word - Word to correct
 * @param {string} prevWord - Previous word in sentence
 * @param {Set} kamus - Dictionary set
 * @param {Array} kamusList - Dictionary list
 * @param {Object} dataset - Unigram dataset
 * @param {Object} bigramDataset - Bigram dataset
 * @param {Set} bigramWords - Set of words from bigram dataset
 * @returns {Array} List of candidates
 */
function getCandidates(word, prevWord, kamus, kamusList, dataset, bigramDataset, bigramWords) {
    // Remove punctuation for lookup but remember it for later
    const punctuation = getPunctuation(word);
    const wordWithoutPunctuation = removePunctuation(word);
    const lowerWord = wordWithoutPunctuation.toLowerCase();
    
    // If the word is empty after removing punctuation, just return original word
    if (lowerWord === '') {
      return [{
        word: word,
        originalWord: word,
        distance: 0,
        probability: 0,
        bigramProb: 0
      }];
    }
    
    console.log(`⚙️ Mencari kandidat untuk: "${lowerWord}"`);
    
    const candidates = new Map();
    
    // First check if word exists in dictionary
    if (kamus.has(lowerWord)) {
      console.log(`✓ Kata "${lowerWord}" ada dalam kamus`);
      // Keep original case instead of dictionary case
      return [{
        word: maintainCase(wordWithoutPunctuation, lowerWord),
        originalWord: word,
        distance: 0,
        probability: dataset[lowerWord] || 0,
        bigramProb: 0,
        punctuation
      }];
    }
    
    // Log untuk debugging
    console.log(`⚠️ Kata "${lowerWord}" tidak ada dalam kamus, mencari alternatif...`);
    
    // PERBAIKAN: Periksa dataset unigram langsung
    // Ini memastikan semua kata dalam dataset diperiksa, tidak hanya yang ada di kamus
    for (const kata in dataset) {
      const distance = levenshtein(lowerWord, kata);
      
      // Log jarak Levenshtein untuk debugging (opsional)
      if (kata === "hermano") {
        console.log(`📏 Jarak "${lowerWord}" ke "hermano": ${distance}`);
      }
      
      // Perbarui threshold untuk bahasa Spanyol (lebih toleran)
      const threshold = 2; // Bisa ditingkatkan menjadi 3 untuk lebih toleran
      
      if (distance <= threshold) {
        candidates.set(kata, {
          word: kata,
          originalWord: word,
          distance,
          probability: dataset[kata],
          bigramProb: 0,
          punctuation
        });
      }
    }
    
    // Search bigram dataset if available
    if (bigramWords && bigramWords.size > 0) {
      for (const bigramWord of bigramWords) {
        const distance = levenshtein(lowerWord, bigramWord);
        if (distance <= 2) {
          // Get unigram probability if available
          const probability = dataset[bigramWord] || 0;
          
          // Check bigram probability if previous word exists
          let bigramProb = 0;
          if (prevWord) {
            const prevWordClean = removePunctuation(prevWord).toLowerCase();
            const bigram = `${prevWordClean} ${bigramWord}`;
            bigramProb = bigramDataset[bigram] || 0;
          }
          
          candidates.set(bigramWord, {
            word: bigramWord,
            originalWord: word,
            distance,
            probability,
            bigramProb,
            punctuation
          });
        }
      }
    }
    
    // If no candidates found, use original word
    if (candidates.size === 0) {
      console.log(`❌ Tidak ditemukan kandidat untuk "${lowerWord}"`);
      return [{
        word: wordWithoutPunctuation,
        originalWord: word,
        distance: 0,
        probability: 0,
        bigramProb: 0,
        punctuation
      }];
    }
    
    // Log jumlah kandidat
    console.log(`🔍 Ditemukan ${candidates.size} kandidat untuk "${lowerWord}"`);
    
    // Sort by priority (Levenshtein distance, bigram probability, unigram probability)
    const sortedCandidates = Array.from(candidates.values())
      .sort((a, b) => {
        // Prioritize smaller distance
        if (a.distance !== b.distance) return a.distance - b.distance;
        
        // If distances equal and previous word exists, prioritize bigram probability
        if (prevWord && (a.bigramProb || b.bigramProb)) {
          return b.bigramProb - a.bigramProb;
        }
        
        // If no bigram, use unigram probability
        return b.probability - a.probability;
      })
      .slice(0, 5);
    
    // Log kandidat teratas
    sortedCandidates.forEach((candidate, idx) => {
      if (idx < 3) { // Tampilkan 3 kandidat teratas saja
        console.log(`🔤 Kandidat #${idx+1}: "${candidate.word}" (jarak: ${candidate.distance}, prob: ${candidate.probability})`);
      }
    });
    
    return sortedCandidates;
  }

/**
 * Extract punctuation from a word
 * @param {string} word - Input word
 * @returns {object} Punctuation object with leading and trailing punctuation
 */
function getPunctuation(word) {
  const leadingPunctRegex = /^[^\w\s]+/;
  const trailingPunctRegex = /[^\w\s]+$/;

  const leadingMatch = word.match(leadingPunctRegex);
  const trailingMatch = word.match(trailingPunctRegex);

  const result = {
    leading: leadingMatch ? leadingMatch[0] : '',
    trailing: trailingMatch ? trailingMatch[0] : ''
  };

  return result;
}

/**
 * Remove punctuation from a word
 * @param {string} word - Input word
 * @returns {string} Word without punctuation
 */
function removePunctuation(word) {
  return word.replace(/^[^\w\s]+|[^\w\s]+$/g, '');
}

/**
 * Maintain case pattern of original word in corrected word
 * @param {string} originalWord - Original word with case
 * @param {string} correctedWord - Corrected word
 * @returns {string} Corrected word with original case pattern
 */
function maintainCase(originalWord, correctedWord) {
  if (originalWord === originalWord.toUpperCase()) {
    return correctedWord.toUpperCase();
  }

  if (originalWord[0] === originalWord[0].toUpperCase()) {
    return correctedWord.charAt(0).toUpperCase() + correctedWord.slice(1);
  }

  return correctedWord.toLowerCase();
}

export {
  levenshtein,
  getCandidates,
  getPunctuation,
  removePunctuation,
  maintainCase
};
