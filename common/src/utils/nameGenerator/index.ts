import { adjectives, nouns } from './data';

export function randomNamesGenerator(): string {
  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min;

  return (
    adjectives[getRandomInt(0, adjectives.length + 1)] +
    '-' +
    nouns[getRandomInt(0, nouns.length + 1)]
  ).toLowerCase();
}
