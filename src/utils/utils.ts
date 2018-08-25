type MappingFunction<E, K> = (e: E) => K;
export const reduceToMapping = <E, K extends number | string>(
  map: MappingFunction<E, K>
) => (mapping: any, e: E) => ({ ...mapping, [map(e)]: e });

export const sortByKey = <E, K>(keyGetter: (e: E) => K, descending = false) => (
  left: E,
  right: E
) => {
  const l = keyGetter(left),
    r = keyGetter(right);
  if (l < r) {
    return descending ? 1 : -1;
  } else if (r < l) {
    return descending ? -1 : 1;
  } else {
    return 0;
  }
};
