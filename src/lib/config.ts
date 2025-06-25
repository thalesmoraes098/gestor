'use client';

// Este arquivo guarda valores de configuração compartilhados que podem ser modificados em tempo de execução.

export let savedClosingDay = '5';

export const setSavedClosingDay = (day: string) => {
  savedClosingDay = day;
};
