import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { FC } from 'react';

// Maps a stored icon name (e.g. "Palette", "whatsapp") to a lucide-react component.
// Falls back to a generic icon when the name isn't recognized.
const ALIASES: Record<string, string> = {
  whatsapp: 'MessageCircle',
  discord: 'MessagesSquare',
  mail: 'Mail',
  gmail: 'Mail',
  instagram: 'Instagram',
  youtube: 'Youtube',
  telegram: 'Send',
  facebook: 'Facebook',
  twitter: 'Twitter',
  x: 'Twitter',
  tiktok: 'Music2',
  linkedin: 'Linkedin',
  behance: 'Palette',
  github: 'Github',
  link: 'Link',
};

export function DynamicIcon({ name, ...props }: { name?: string | null } & LucideProps) {
  if (!name) return <Icons.Sparkles {...props} />;
  const key = ALIASES[name.toLowerCase()] || name;
  const Cmp = (Icons as unknown as Record<string, FC<LucideProps>>)[key];
  const Fallback = Icons.Sparkles;
  const Resolved = Cmp || Fallback;
  return <Resolved {...props} />;
}
