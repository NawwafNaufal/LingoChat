const fs = require('fs');
const path = require('path');

/**
 * @param {string} language 
 * @param {object} dictionaries 
 * @returns {object} 
 */
function loadDictionaries(language, dictionaries) {
  const languageConfig = dictionaries[language];
  const kamusPath = path.join(__dirname, languageConfig.kamus);

  const kamusText = fs.readFileSync(kamusPath, 'utf-8');
  const kamusList = kamusText.split('\n').map(k => k.trim().toLowerCase()).filter(Boolean);
  const kamus = new Set(kamusList);

  const datasetPath = path.join(__dirname, languageConfig.dataset);
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  const targetCorrectionWords = Object.keys(dataset);

  const bigramPath = path.join(__dirname, languageConfig.bigram);
  let bigramDataset = {};

  try {
    bigramDataset = JSON.parse(fs.readFileSync(bigramPath, 'utf-8'));
  } catch (err) {
    console.warn("⚠️ File BigramProbs.json tidak ditemukan atau tidak valid. Bigram tidak akan digunakan.");
  }

  const bigramWords = new Set();
  Object.keys(bigramDataset).forEach(bigram => {
    const words = bigram.split(' ');
    if (words.length === 2) {
      bigramWords.add(words[0]);
      bigramWords.add(words[1]);
    }
  });
  console.log(`🔍 Jumlah kata dalam dataset bigram: ${bigramWords.size}`);

  return {
    kamus,
    kamusList,
    dataset,
    bigramDataset,
    bigramWords
  };
}

module.exports = {
  loadDictionaries
};