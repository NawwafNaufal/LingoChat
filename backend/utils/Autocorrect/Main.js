import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDictionaries } from './dictUtils.js';
import { levenshtein } from './correctionUtils.js';
import { autocorrectWithBigram } from './autocorrect.js';

// === PILIHAN BAHASA ===
const language = 'id'; // 'id' untuk Indonesia, 'en' untuk English, 'es' untuk Spanish

// === KONFIGURASI PATH BERDASARKAN BAHASA ===
const dictionaries = {
  id: {
    kamus: '../Autocorrect/Dictionary/KBBI.txt',
    dataset: '../Autocorrect/Dictionary/CorpusIndo.json',
    bigram: '../Autocorrect/Dictionary/BigramKataUmum.json'
  },
  en: {
    kamus: '../Autocorrect/Dictionary/OID.txt',
    dataset: '../Autocorrect/Dictionary/CorpusEngUnigram.json',
    bigram: '../Autocorrect/Dictionary/BigramKataUmumEng.json'
  },
  es: {
    kamus: '../Autocorrect/Dictionary/SPANISHTEXT.txt',
    dataset: '../Autocorrect/Dictionary/CorpusSpanUnigram.json',
    bigram: '../Autocorrect/Dictionary/BigramKataUmumSpan.json'
  }
};

// Validasi bahasa yang dipilih
if (!dictionaries[language]) {
  console.error(`Error: Bahasa "${language}" tidak didukung. Gunakan 'id', 'en', atau 'es'.`);
  process.exit(1);
}

try {
  // Load dictionaries and datasets
  const { kamus, kamusList, dataset, bigramDataset, bigramWords } = loadDictionaries(language, dictionaries);
  
  // === INPUT DARI TERMINAL ===
  function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      const messages = {
        id: "Gunakan: node Main.js \"Kalimat yang ingin dikoreksi\"",
        en: "Usage: node Main.js \"Sentence you want to correct\"",
        es: "Uso: node Main.js \"Frase que desea corregir\""
      };
      console.log(messages[language]);
      return;
    }

    const inputSentence = args.join(" ");
    
    const labels = {
      id: {
        original: "⌨️ Kalimat asli:",
        timing: "⏱️ Waktu Koreksi",
        corrected: "✅ Setelah koreksi:"
      },
      en: {
        original: "⌨️ Original sentence:",
        timing: "⏱️ Correction Time",
        corrected: "✅ After correction:"
      },
      es: {
        original: "⌨️ Frase original:",
        timing: "⏱️ Tiempo de corrección",
        corrected: "✅ Después de la corrección:"
      }
    };
    
    console.log(labels[language].original, inputSentence);

    console.time(labels[language].timing);
    const result = autocorrectWithBigram(inputSentence, kamus, kamusList, dataset, bigramDataset, bigramWords);
    console.timeEnd(labels[language].timing);

    console.log(labels[language].corrected, result);
    console.log(`🌐 Language: ${language.toUpperCase()}`);
  }

  main();

} catch (error) {
  console.error(`Error: File untuk bahasa "${language}" tidak ditemukan.`);
  console.error(`Detail: ${error.message}`);
  console.error(`Pastikan file ${dictionaries[language].kamus}, ${dictionaries[language].dataset}, dan ${dictionaries[language].bigram} tersedia di direktori yang sama.`);
  process.exit(1);
}