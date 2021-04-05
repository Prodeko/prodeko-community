/**
 * Groups array of objects into an object with keys based on `getKey`
 * parameter. For example:
 *
 * pets = [
 *  {type:"Dog", name:"Spot"},
 *  {type:"Cat", name:"Tiger"},
 *  {type:"Dog", name:"Rover"},
 *  {type:"Cat", name:"Leo"}
 * ];
 *
 * grouped = groupBy(pets, pet => pet.type)
 *
 * grouped ->
 * {
 *  "Dog": [{type:"Dog", name:"Spot"}, {type:"Dog", name:"Rover"}],
 *  "Cat": [{type:"Cat", name:"Tiger"}, {type:"Cat", name:"Leo"}]
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function groupBy<T, K extends keyof any>(items: T[], getKey: (item: T) => K) {
  return items.reduce((acc, curr) => {
    (acc[getKey(curr)] = acc[getKey(curr)] || []).push(curr);
    return acc;
  }, {} as Record<K, T[]>);
}
