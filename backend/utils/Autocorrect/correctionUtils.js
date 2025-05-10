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
* Check if a string is a number or contains only digits
* @param {string} str - String to check
* @returns {boolean} True if the string is a number
*/
function isNumber(str) {
return !isNaN(str) && /^\d+$/.test(str);
}

/**
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
const punctuation = getPunctuation(word);
const wordWithoutPunctuation = removePunctuation(word);
const lowerWord = wordWithoutPunctuation.toLowerCase();

if (lowerWord === '') {
  return [{
    word: word,
    originalWord: word,
    distance: 0,
    probability: 0,
    bigramProb: 0
  }];
}

// Skip processing if the word is a number
if (isNumber(lowerWord)) {
  return [{
    word: wordWithoutPunctuation,
    originalWord: word,
    distance: 0,
    probability: 0,
    bigramProb: 0,
    punctuation
  }];
}

const candidates = new Map();

if (kamus.has(lowerWord)) {
  return [{
    word: maintainCase(wordWithoutPunctuation, lowerWord),
    originalWord: word,
    distance: 0,
    probability: dataset[lowerWord] || 0,
    bigramProb: 0,
    punctuation
  }];
}

for (const kata of kamusList) {
  const distance = levenshtein(lowerWord, kata);
  if (distance <= 3 && dataset[kata]) {
    candidates.set(kata, {
      word: kata,
      originalWord: word,
      distance,
      probability: dataset[kata],
      punctuation
    });
  }
}

for (const bigramWord of bigramWords) {
  const distance = levenshtein(lowerWord, bigramWord);
  if (distance <= 3) {
    const probability = dataset[bigramWord] || 0;
    
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

if (candidates.size === 0) {
  return [{
    word: wordWithoutPunctuation,
    originalWord: word,
    distance: 0,
    probability: 0,
    bigramProb: 0,
    punctuation
  }];
}

return Array.from(candidates.values())
  .sort((a, b) => {
    // Jika jarak berbeda, prioritaskan jarak terkecil
    if (a.distance !== b.distance) return a.distance - b.distance;
    
    // Perhitungan skor dengan prioritas bigram 1000x lebih penting
    const aUnigramScore = a.probability || 0;
    const bUnigramScore = b.probability || 0;
    const aBigramScore = a.bigramProb || 0;
    const bBigramScore = b.bigramProb || 0;
    
    const aTotalScore = (aBigramScore * 1000) + aUnigramScore;
    const bTotalScore = (bBigramScore * 1000) + bUnigramScore;
    
    // Bandingkan total skor
    return bTotalScore - aTotalScore;
  })
  .slice(0, 5);
}

/**
* @param {string} word 
* @returns {object} 
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

console.log(`Tanda baca untuk "${word}":`, result);
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
maintainCase,
isNumber
};