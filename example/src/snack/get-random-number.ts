export const getRandomNumber = (currentValue: number, dataCount: number) => {
  let randomValue;
  do {
    randomValue = Math.floor(Math.random() * dataCount);
  } while (randomValue === currentValue);
  return randomValue;
};
