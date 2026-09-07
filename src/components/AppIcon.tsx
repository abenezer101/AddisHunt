import type { ReactElement, SVGProps } from "react";

const paths: Record<string, ReactElement> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  plusCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M7 7h10v10" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  box: (
    <>
      <path d="m12 2 9 5v10l-9 5-9-5V7z" />
      <path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 22V12" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0z" />
      <path d="M7 6H4a1 1 0 0 0-1 1c0 2.5 2 4 4 4M17 6h3a1 1 0 0 1 1 1c0 2.5-2 4-4 4" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="15" r="6" />
      <path d="m8.5 10-3-7h5l2 4 2-4h5l-3 7" />
    </>
  ),
  crown: <path d="m3 8 4 4 5-6 5 6 4-4-1.5 10h-15z" />,
  rocket: (
    <>
      <path d="M12 15c5 0 7-3 7-7l-3-3c-4 0-7 2-7 7l-3 7 3-3z" />
      <circle cx="15" cy="9" r="1.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  checklist: (
    <>
      <path d="m4 12 2 2 4-4M4 18l2 2 4-4M12 8h8M12 14h8M12 20h8" />
    </>
  ),
  sparkles: <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </>
  ),
  chart: <path d="M3 21h18M7 17V9m5 8V5m5 12v-6" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  tag: (
    <>
      <path d="m3 12 9-9h9v9l-9 9z" />
      <circle cx="17" cy="8" r="1.5" />
    </>
  ),
  check: <path d="m4 12 5 5L20 6" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
      <circle cx="12" cy="13" r="3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 2h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 22h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" />
    </>
  ),
  star: <path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7-6.2-3.4-6.2 3.4 1.4-7L2 9.4l7-.8z" />,
  reply: <path d="M9 17 4 12l5-5M4 12h9a7 7 0 0 1 7 7v1" />,
  share: (
    <>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="m8.6 10.6 6.8-3.2M8.6 13.4l6.8 3.2" />
    </>
  ),
  bold: <path d="M7 4h6a4 4 0 0 1 0 8H7zm0 8h7a4 4 0 0 1 0 8H7z" />,
  italic: <path d="M15 4h4M11 4H7m4 0 2 16m-2 0h-4m8 0h4" />,
};

const alias: Record<string, string> = {
  "solar:magnifer-linear": "search",
  "solar:bell-linear": "bell",
  "solar:add-circle-linear": "plusCircle",
  "solar:alt-arrow-down-linear": "chevronDown",
  "solar:alt-arrow-right-linear": "arrowRight",
  "solar:alt-arrow-left-linear": "chevronLeft",
  "solar:user-circle-linear": "user",
  "solar:box-linear": "box",
  "solar:hamburger-menu-linear": "menu",
  "solar:close-circle-linear": "close",
  "solar:cup-star-bold": "trophy",
  "solar:medal-ribbon-bold": "medal",
  "solar:crown-star-bold": "crown",
  "solar:rocket-bold": "rocket",
  "solar:calendar-date-bold": "calendar",
  "solar:calendar-linear": "calendar",
  "solar:checklist-minimalistic-bold": "checklist",
  "solar:check-circle-bold": "checkCircle",
  "solar:check-read-linear": "check",
  "solar:stars-minimalistic-bold": "sparkles",
  "solar:letter-bold": "mail",
  "solar:graph-up-bold": "chart",
  "solar:export-linear": "arrowUpRight",
  "solar:star-linear": "star",
  "solar:reply-linear": "reply",
  "solar:share-linear": "share",
  "solar:global-linear": "globe",
  "solar:map-point-linear": "pin",
  "solar:tag-price-linear": "tag",
  "solar:camera-add-linear": "camera",
  "solar:settings-linear": "settings",
  "solar:text-bold-linear": "bold",
  "solar:text-italic-linear": "italic",
  "ri:linkedin-fill": "box",
  "ri:telegram-fill": "share",
  "ri:github-fill": "box",
  "ri:discord-fill": "share",
  "ri:twitter-x-fill": "close",
};

interface AppIconProps extends SVGProps<SVGSVGElement> {
  icon: string;
}

export function Icon({ icon, width = "1em", height = "1em", ...props }: AppIconProps) {
  const key = alias[icon] ?? "box";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={icon.endsWith("-bold") || icon.includes(":cup") ? 2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[key]}
    </svg>
  );
}
