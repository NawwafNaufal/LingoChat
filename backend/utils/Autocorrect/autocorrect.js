import { getCandidates, maintainCase }  from './correctionUtils.js';

/**
 * @param {string} text - Input text
 * @returns {Array} Array with words and separators alternating
 */
function splitKeepingSeparators(text) {
    const bracketedContents = [];
    const bracketPattern = /(\{[^{}]*\}|\([^()]*\)|\[[^\[\]]*\])/g;
    
    const textWithPlaceholders = text.replace(bracketPattern, (match) => {
      const placeholder = `__BRACKET_${bracketedContents.length}__`;
      bracketedContents.push(match);
      return placeholder;
    });
    
    const regex = /(\s+)/;
    const parts = textWithPlaceholders.split(regex);
    
    return parts.map(part => {
      const bracketMatch = part.match(/__BRACKET_(\d+)__/);
      if (bracketMatch) {
        return bracketedContents[parseInt(bracketMatch[1])];
      }
      return part;
    });
  }

/**
 * Check if a string is a number or contains only digits
 * @param {string} str - String to check
 * @returns {boolean} True if the string is a number
 */
function isNumber(str) {
  // Remove leading/trailing punctuation if any
  const cleanStr = str.replace(/^[^\w\s]+|[^\w\s]+$/g, '');
  // Check if it's a number or contains only digits
  return !isNaN(cleanStr) && /^\d+$/.test(cleanStr);
}
  
/**
 * @param {string} sentence - Input sentence to correct
 * @param {Set} kamus - Dictionary set
 * @param {Array} kamusList - Dictionary list
 * @param {Object} dataset - Unigram dataset
 * @param {Object} bigramDataset - Bigram dataset
 * @param {Set} bigramWords - Set of words from bigram dataset
 * @returns {string} Corrected sentence
 */
function autocorrectWithBigram(sentence, kamus, kamusList, dataset, bigramDataset, bigramWords) {
  const leadingSpace = sentence.match(/^\s*/)[0];
  const trailingSpace = sentence.match(/\s*$/)[0];
  
  const parts = sentence.trim().split(/\s+/);
  const corrected = [];
  
  for (let i = 0; i < parts.length; i++) {
    const currentWord = parts[i];
    const prevWord = i > 0 ? corrected[i-1] : null;
    
    if (!currentWord.trim()) {
      corrected.push(currentWord);
      continue;
    }
    
    if (/^\{.*\}$|^\(.*\)$|^\[.*\]$/.test(currentWord)) {
      corrected.push(currentWord);
      continue;
    }
    
    // Skip correction for numbers
    if (isNumber(currentWord)) {
      corrected.push(currentWord);
      continue;
    }
    
    let candidates = getCandidates(currentWord, prevWord, kamus, kamusList, dataset, bigramDataset, bigramWords);
    
    if (candidates.length === 0) {
      corrected.push(currentWord);
      continue;
    }
    
    let bestCandidate = candidates[0];
    
    const finalCandidate = applyOriginalCaseAndPunctuation(bestCandidate);
    corrected.push(finalCandidate);
  }
  
  return leadingSpace + corrected.join(' ') + trailingSpace;
}
  /**
   * Apply original case pattern and punctuation to corrected word
   * @param {object} candidate - Candidate object
   * @returns {string} Final word with original case and punctuation
   */
  function applyOriginalCaseAndPunctuation(candidate) {
    let finalWord = candidate.word;
    
    if (candidate.originalWord) {
      finalWord = maintainCase(candidate.originalWord, finalWord);
    }
    
    if (candidate.punctuation) {
      finalWord = candidate.punctuation.leading + finalWord + candidate.punctuation.trailing;
    }
    
    return finalWord;
  }
  
export {
    autocorrectWithBigram,
    splitKeepingSeparators,
    isNumber
  };