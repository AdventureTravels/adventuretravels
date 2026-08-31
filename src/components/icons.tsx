type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export function MenuIcon({
  size = 22,
  color = "currentColor",
  strokeWidth = 2.2,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M4 7 H20" />
      <path d="M4 12 H20" />
      <path d="M4 17 H20" />
    </svg>
  );
}

/** The AT-ligature brand mark: also used, rotated, as the arrow glyph in buttons. */
export function AtMark({
  size = 30,
  color = "currentColor",
  strokeWidth = 5.5,
  className,
  rotate = 0,
}: IconProps & { rotate?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <g transform={rotate ? `rotate(${rotate} 24 24)` : undefined}>
        <path d="M9 35 L24 11 L39 35" />
        <path d="M15.5 25 H32.5" />
        <path d="M24 25 V39" />
      </g>
    </svg>
  );
}

/** Forward arrow (mark rotated 90°) used in primary/secondary CTAs. */
export function ArrowIcon(props: IconProps) {
  return <AtMark {...props} rotate={90} />;
}

/** Back arrow (mark rotated -90°) used in "previous" slider controls. */
export function PrevArrowIcon(props: IconProps) {
  return <AtMark {...props} rotate={-90} />;
}

export function ChevronDownIcon({
  size = 11,
  color = "#5E5E4E",
  strokeWidth = 2.2,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M5 9 L12 16 L19 9" />
    </svg>
  );
}

export function WaveIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
  waves = 2,
}: IconProps & { waves?: 2 | 3 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M4 20 C10 14, 14 26, 20 20 C26 14, 30 26, 36 20 C40 16, 42 20, 44 21" />
      <path d="M4 30 C10 24, 14 36, 20 30 C26 24, 30 36, 36 30 C40 26, 42 30, 44 31" />
      {waves === 3 && <path d="M4 40 C10 34, 14 46, 20 40" />}
    </svg>
  );
}

export function PinIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M24 43 C24 43, 37 30, 37 19 A13 13 0 0 0 11 19 C11 30, 24 43, 24 43 Z" />
      <circle cx="24" cy="19" r="5" />
    </svg>
  );
}

export function CalendarIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
  seasons = false,
}: IconProps & { seasons?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <circle cx="24" cy="24" r="9" />
      <path d="M24 6 V11" />
      <path d="M24 37 V42" />
      <path d="M6 24 H11" />
      <path d="M37 24 H42" />
      {seasons && (
        <>
          <path d="M11.5 11.5 L15 15" />
          <path d="M33 33 L36.5 36.5" />
        </>
      )}
    </svg>
  );
}

export function LevelIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M4 38 L18 14 L27 28" />
      <path d="M22 38 L32 20 L44 38 Z" />
      <path d="M4 38 H44" />
    </svg>
  );
}

export function HouseIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
  door = false,
}: IconProps & { door?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M6 22 L24 8 L42 22" />
      <path d="M11 22 V40 H37 V22" />
      {door && <path d="M20 40 V29 H28 V40" />}
    </svg>
  );
}

export function CompassIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <circle cx="24" cy="24" r="19" />
      <path d="M31 17 L27 27 L17 31 L21 21 Z" />
    </svg>
  );
}

export function MountainBikeIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
  crossbar = false,
}: IconProps & { crossbar?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <circle cx="11" cy="33" r="8" />
      <circle cx="37" cy="33" r="8" />
      <path d="M11 33 L21 17 H31" />
      <path d="M37 33 L28 17" />
      {crossbar && <path d="M21 33 H33" />}
    </svg>
  );
}

export function PlaneIcon({
  size = 18,
  color = "currentColor",
  strokeWidth = 1.6,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M5 26 L43 12 L31 30 L26 30 L21 40 L17 40 L19 29 Z" />
      <path d="M14 43 H30" />
    </svg>
  );
}

export function CheckCircleIcon({
  size = 20,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <circle cx="24" cy="24" r="19" />
      <path d="M16 24 L22 30 L33 19" />
    </svg>
  );
}

export function CloseIcon({
  size = 10,
  color = "currentColor",
  strokeWidth = 2.4,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M5 5 L19 19" />
      <path d="M19 5 L5 19" />
    </svg>
  );
}

export function NoResultsIcon({
  size = 38,
  color = "currentColor",
  strokeWidth = 1.8,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <circle cx="21" cy="21" r="14" />
      <path d="M31 31 L42 42" />
      <path d="M15 21 H27" />
    </svg>
  );
}

export function PlusIcon({
  size = 34,
  color = "currentColor",
  strokeWidth = 1.8,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <circle cx="24" cy="24" r="19" />
      <path d="M24 15 V33" />
      <path d="M15 24 H33" />
    </svg>
  );
}

export function ShieldIcon({
  size = 30,
  color = "currentColor",
  strokeWidth = 1.8,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M24 5 L40 11 V24 C40 34, 32 41, 24 44 C16 41, 8 34, 8 24 V11 Z" />
      <path d="M17 24 L22 29 L31 19" />
    </svg>
  );
}

export function DocumentIcon({
  size = 30,
  color = "currentColor",
  strokeWidth = 1.8,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M12 5 H29 L36 12 V43 H12 Z" />
      <path d="M29 5 V12 H36" />
      <path d="M18 24 H30" />
      <path d="M18 32 H30" />
    </svg>
  );
}

export function BuildingIcon({
  size = 30,
  color = "currentColor",
  strokeWidth = 1.8,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M10 43 V13 L24 6 L38 13 V43" />
      <path d="M18 43 V30 H30 V43" />
      <path d="M18 20 H22" />
      <path d="M26 20 H30" />
    </svg>
  );
}

export function PhoneIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2.2,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M13 7 H21 L25 17 L20 21 C22 27, 26 31, 32 33 L36 28 L46 32 V40 C46 42, 44 44, 42 44 C24 42, 10 28, 8 11 C8 9, 10 7, 13 7 Z" />
    </svg>
  );
}

export function MailIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2.2,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M6 13 H42 V35 H6 Z" />
      <path d="M6 13 L24 26 L42 13" />
    </svg>
  );
}

export function ClockIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2.2,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <circle cx="24" cy="24" r="18" />
      <path d="M24 13 V24 L32 29" />
    </svg>
  );
}

export function LockIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 1.8,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <path d="M12 21 H36 V42 H12 Z" />
      <path d="M17 21 V14 A7 7 0 0 1 31 14 V21" />
    </svg>
  );
}

export function AlertCircleIcon({
  size = 17,
  color = "#A63F2C",
  strokeWidth = 2,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7 V13" />
      <path d="M12 16.5 V16.6" />
    </svg>
  );
}

/** Dag/avond sun-on-horizon mark: solid upper cap, dashed lower half. */
export function SunMark({
  size = 74,
  color = "#C7513C",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flex: "none",
        background: `linear-gradient(to bottom, ${color} 0 42%, ${color}00 42%), repeating-linear-gradient(to bottom, ${color} 0 3px, ${color}00 3px 6px)`,
      }}
    />
  );
}
