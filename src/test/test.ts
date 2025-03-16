const regex = /"answer"\s*:\s*"((?:\\"|\\n|[^"])*)"/;
const rawText = `"answer":"\n\\n\n\n"`;
console.log('sss', rawText.match(regex)?.[1]);
