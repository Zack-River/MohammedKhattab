export interface ActionMenuLink { href: string; label: string; external?: boolean }
export interface ActionMenuProps {
  trigger: React.ReactNode; label: string; links: readonly ActionMenuLink[];
  action: { label: string; onSelect: () => void; disabled?: boolean }; error?: string;
}
