import diff from 'diff-arrays-of-objects';

const dangerousTypes = ['translations', 'alias', 'o2m', 'm2m', 'm2a'];
const dangerousFilter = (field: any) =>
  dangerousTypes.includes(field.type) || field.collection === 'languages';

/**
 * We want to add each new collections' fields as a bulk operation with the
 * collection itself so that it causes less requests and doesn't make the
 * collection end up in an orphan-like state where Directus doesn't know how
 * to interact with it
 *
 * This applies to addition and deletion of collections, and all fields that
 * relate to changed collections.
 */
export function generateGroupedData(oldData: any, newData: any) {
  let dataToApply = newData;

  const collectionDiff = diff(oldData.collections, newData.collections, 'pk');
  if (collectionDiff.added.length) {
    // Add all fields of the collection in one fell swoop
    const newCollections = collectionDiff.added;
    const filledCollections = newCollections.map((c: any) => ({
      ...c,
      fields: newData.fields.filter(
        (f: any) => f.collection === c.collection && !dangerousFilter(f)
      ),
    }));
    const newCollectionsNames = filledCollections.map((c: any) => c.collection);

    const leftoverFields = newData.fields.filter(
      (f: any) => !newCollectionsNames.includes(f.collection) || dangerousFilter(f)
    );

    dataToApply.collections = [
      ...newData.collections.filter((c: any) => !newCollectionsNames.includes(c.collection)),
      ...filledCollections,
    ];
    dataToApply.fields = leftoverFields;
  }
  // When we delete a collection, all fields related to it get deleted too so we
  // filter them out from the field comparisons
  if (collectionDiff.removed.length) {
    const removedCollections = collectionDiff.removed;
    const removedCollectionsNames = removedCollections.map((c: any) => c.collection);
    // We append old data to object being applied so that the field diff ignores
    // the fields which will get removed in the same pass as collections
    dataToApply.fields = [
      ...dataToApply.fields,
      ...oldData.fields.filter((f: any) => removedCollectionsNames.includes(f.collection)),
    ];
  }

  return dataToApply;
}

/**
 * Returns a list of all fields that belong to given collection
 */
export function relatedFields(collection: any, data: any) {
  return data.fields.filter((f: any) => f.collection === collection.collection);
}

/**
 * Returns a list of matching items from another array
 */
export function getMatchingCollections(target: any, others: any) {
  const targetPks = target.map((c: any) => c.pk);
  return others.filter((c: any) => targetPks.includes(c.pk));
}
