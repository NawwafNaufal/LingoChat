// autocorrector.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDictionaries } from './dictUtils.js';
import { levenshtein } from './correctionUtils.js';
import { autocorrectWithBigram } from './autocorrect.js';
const labelToCode = {
  English: 'en',
  Indonesia: 'id',
  Spanish: 'es',
};
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

export async function autocorrectMessage(sentence, language) {
  if (!dictionaries[labelToCode[language]]) {
    throw new Error(`Bahasa "${language}" tidak didukung.`);
  }

  try {
    const { kamus, kamusList, dataset, bigramDataset, bigramWords } = loadDictionaries(labelToCode[language], dictionaries);
    const corrected = autocorrectWithBigram(sentence, kamus, kamusList, dataset, bigramDataset, bigramWords);
    return corrected;
  } catch (error) {
    throw new Error(`Gagal melakukan autocorrect: ${error.message}`);
  }
}
