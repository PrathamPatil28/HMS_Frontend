import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="lg"
      radius="xl"
      aria-label="Toggle color scheme"
      className="border-gray-200 dark:border-gray-700 dark:bg-slate-800 text-slate-600 dark:text-yellow-400"
    >
      {computedColorScheme === 'light' ? (
         <IconMoon className="w-5 h-5" stroke={1.5} />
      ) : (
         <IconSun className="w-5 h-5" stroke={1.5} />
      )}
    </ActionIcon>
  );
}