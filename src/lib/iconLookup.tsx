import type { ReactNode } from "react";
import {
  WaveIcon,
  MountainBikeIcon,
  LevelIcon,
  HouseIcon,
  PinIcon,
  CompassIcon,
  CalendarIcon,
  PlaneIcon,
  ShieldIcon,
  DocumentIcon,
  BuildingIcon,
} from "@/components/icons";

type IconComponent = (props: { size?: number; color?: string; strokeWidth?: number }) => ReactNode;

export const ICONS: Record<string, IconComponent> = {
  wave: WaveIcon,
  mountainbike: MountainBikeIcon,
  level: LevelIcon,
  house: HouseIcon,
  pin: PinIcon,
  compass: CompassIcon,
  calendar: CalendarIcon,
  plane: PlaneIcon,
  shield: ShieldIcon,
  document: DocumentIcon,
  building: BuildingIcon,
};

export const ICON_OPTIONS = Object.keys(ICONS);

export function renderIcon(
  key: string,
  { size = 24, color = "#23261F", strokeWidth = 1.8 }: { size?: number; color?: string; strokeWidth?: number } = {}
): ReactNode {
  const Icon = ICONS[key] ?? WaveIcon;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
