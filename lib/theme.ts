import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(225, 60%, 98%)',          // Fondo muy claro con un leve tono azulado
    foreground: 'hsl(225, 30%, 12%)',          // Texto principal azul grisáceo oscuro

    card: 'hsl(0, 0%, 100%)',                  // Fondo de tarjeta blanco puro
    cardForeground: 'hsl(225, 30%, 12%)',      // Texto oscuro sobre fondo claro

    popover: 'hsl(0, 0%, 100%)',               // Fondo blanco para popovers o tooltips
    popoverForeground: 'hsl(225, 30%, 12%)',

    primary: 'hsl(224, 63%, 40%)',             // Azul principal (coherente con modo oscuro)
    primaryForeground: 'hsl(0, 0%, 100%)',     // Texto blanco sobre botones azules

    secondary: 'hsl(224, 45%, 92%)',           // Azul muy claro para secciones secundarias
    secondaryForeground: 'hsl(225, 35%, 20%)', // Texto más oscuro para contraste

    muted: 'hsl(225, 40%, 94%)',               // Suave para fondos atenuados
    mutedForeground: 'hsl(225, 20%, 45%)',     // Texto gris azulado medio

    accent: 'hsl(224, 63%, 45%)',              // Azul brillante para acentos o enlaces
    accentForeground: 'hsl(0, 0%, 100%)',

    destructive: 'hsl(0, 72%, 60%)',           // Rojo elegante para alertas
    border: 'hsl(225, 25%, 85%)',              // Borde sutil azulado
    input: 'hsl(225, 25%, 88%)',               // Campos de entrada con borde leve

    ring: 'hsl(224, 63%, 45%)',                // Resalte de foco en azul
    radius: '0.625rem',


    gradient: ['hsl(224, 63%, 40%)', 'hsl(226, 63%, 55%)'],
    // Colores de gráficos suaves, manteniendo relación con la gama base
    chart1: 'hsl(224, 63%, 45%)',              // Azul primario
    chart2: 'hsl(225, 60%, 55%)',              // Azul medio
    chart3: 'hsl(226, 45%, 65%)',              // Azul pastel
    chart4: 'hsl(227, 40%, 75%)',              // Azul grisáceo claro
    chart5: 'hsl(228, 50%, 35%)',              // Azul profundo para contraste
  },

  dark: {
    background: 'hsl(226, 63%, 12%)',         // #0C1634 - fondo principal profundo
    foreground: 'hsl(225, 38%, 93%)',         // texto claro, buena legibilidad

    card: 'hsl(227, 63%, 18%)',               // #122251 - fondo de tarjetas
    cardForeground: 'hsl(225, 50%, 97%)',     // texto casi blanco

    popover: 'hsl(227, 61%, 26%)',            // #182E6D - fondo de popovers
    popoverForeground: 'hsl(0, 0%, 100%)',    // blanco puro

    primary: 'hsl(224, 63%, 40%)',            // #2547A7 - azul principal
    primaryForeground: 'hsl(0, 0%, 100%)',    // blanco sobre azul

    secondary: 'hsl(226, 63%, 34%)',          // #1F3B8B - azul secundario
    secondaryForeground: 'hsl(225, 55%, 94%)',

    muted: 'hsl(227, 63%, 18%)',              // similar al card, para áreas atenuadas
    mutedForeground: 'hsl(225, 25%, 75%)',

    accent: 'hsl(224, 63%, 40%)',             // mismo que primary, mantiene coherencia
    accentForeground: 'hsl(0, 0%, 100%)',

    destructive: 'hsl(0, 72%, 64%)',          // rojo controlado para acciones peligrosas
    border: 'hsl(227, 61%, 26%)',             // coincide con popover
    input: 'hsl(227, 61%, 26%)',              // campos de entrada ligeramente resaltados

    ring: 'hsl(224, 63%, 45%)',               // resalte de enfoque
    radius: '0.625rem',


    gradient: ['hsl(224, 63%, 40%)', 'hsl(226, 63%, 20%)'],
    // Paleta para gráficos (armonizada en tonos fríos y balanceados)
    chart1: 'hsl(224, 63%, 45%)',
    chart2: 'hsl(226, 63%, 36%)',
    chart3: 'hsl(227, 63%, 28%)',
    chart4: 'hsl(228, 63%, 20%)',
    chart5: 'hsl(224, 63%, 55%)',

    
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};