export function refMerge(orig, dataToMerge) {
  for (const key in dataToMerge) {
    if (key in orig) continue;

    orig[key] = dataToMerge[key];
  }
}

export const getPath = (path, obj) =>
  path.split(".").reduce((acc, val) => acc[val], obj);
