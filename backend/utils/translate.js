import { translate } from "@vitalets/google-translate-api";

// Mapping label dari FE ke kode bahasa
const labelToCode = {
  English: 'en',
  Indonesia: 'id',
  Spanish: 'es',
};

export async function translateMessage(message, fromLangLabel, toLangLabel) {
  if (!message || !fromLangLabel || !toLangLabel) {
    throw new Error('Missing message or language parameters');
  }

  const fromLang = labelToCode[fromLangLabel];
  const toLang = labelToCode[toLangLabel];

  if (!fromLang || !toLang) {
    throw new Error('Unsupported language label');
  }

  const result = await translate(message, { from: fromLang, to: toLang });
  return result.text;
}
