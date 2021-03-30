declare module 'diff-arrays-of-objects' {
  function diff<T>(
    oldData: T[],
    newData: T[],
    idKey: string
  ): { same: T[]; added: T[]; updated: T[]; removed: T[] };
  export = diff;
}
