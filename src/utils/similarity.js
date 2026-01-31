export const simpleSimilarity = (a, b) => {
  if (!a || !b) return 0;
  if (a === b) return 100;


  if (a.includes(b) || b.includes(a)) return 80;


  const onlyDigitsA = a.replace(/\D/g, "");
  const onlyDigitsB = b.replace(/\D/g, "");

  if (onlyDigitsA && onlyDigitsB) {
    let same = 0;
    const minLen = Math.min(onlyDigitsA.length, onlyDigitsB.length);

    for (let i = 0; i < minLen; i++) {
      if (onlyDigitsA[i] === onlyDigitsB[i]) same++;
    }

    return Math.round((same / Math.max(onlyDigitsA.length, onlyDigitsB.length)) * 100);
  }

  return 0;
};