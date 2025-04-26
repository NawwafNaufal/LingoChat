import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Definisikan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads dictionaries and datasets based on selected language
 * @param {string} language - Selected language code
 * @param {object} dictionaries - Configuration object for dictionaries
 * @returns {object} Object containing loaded dictionaries and datasets
 */
function loadDictionaries(language, dictionaries) {
  const languageConfig = dictionaries[language];
  const kamusPath = path.join(__dirname, languageConfig.kamus);

  // Load the dictionary
  const kamusText = fs.readFileSync(kamusPath, 'utf-8');
  const kamusList = kamusText.split('\n').map(k => k.trim().toLowerCase()).filter(Boolean);
  const kamus = new Set(kamusList);

  // Load unigram dataset
  const datasetPath = path.join(__dirname, languageConfig.dataset);
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

  // Load bigram dataset (optional)
  const bigramPath = path.join(__dirname, languageConfig.bigram);
  let bigramDataset = {};

  try {
    bigramDataset = JSON.parse(fs.readFileSync(bigramPath, 'utf-8'));
  } catch (err) {
    console.warn("⚠️ File BigramProbs.json tidak ditemukan atau tidak valid. Bigram tidak akan digunakan.");
  }

  // Extract words from bigram dataset
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

export { loadDictionaries };
