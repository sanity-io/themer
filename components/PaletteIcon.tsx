// @TODO take a URL as input, output an SVG icon of what the palette looks like

import { memo } from 'react'

function PaletteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 42 42"
      height="1em"
      width="1em"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 6c-2.20912 0-4 1.790878-4 4v22c0 2.209122 1.79088 4 4 4h26c2.209122 0 4-1.790878 4-4V10c0-2.209122-1.790878-4-4-4Z"
      />
      <g fillRule="evenodd">
        <path fill="#f7f2f5" d="M8 32h2v-2H8Z" />
        <path fill="#ece3e9" d="M10 32h2v-2h-2Z" />
        <path fill="#e1d5df" d="M12 32h2v-2h-2Z" />
        <path fill="#cbb9c7" d="M14 32h2v-2h-2Z" />
        <path fill="#b59db1" d="M16 32h2v-2h-2Z" />
        <path fill="#a0819a" d="M18 32h2v-2h-2Z" />
        <path fill="#8b6584" d="M20 32h2v-2h-2Z" />
        <path fill="#715570" d="M22 32h2v-2h-2Z" />
        <path fill="#5b455c" d="M24 32h2v-2h-2Z" />
        <path fill="#453648" d="M26 32h2v-2h-2Z" />
        <path fill="#2e2634" d="M28 32h2v-2h-2Z" />
        <path fill="#221e2a" d="M30 32h2v-2h-2Z" />
        <path fill="#171721" d="M32 32h2v-2h-2Z" />
      </g>
      <g fillRule="evenodd">
        <path fill="#f7f2f5" d="M8 28h2v-2H8Z" />
        <path fill="#ece3e9" d="M10 28h2v-2h-2Z" />
        <path fill="#e1d5df" d="M12 28h2v-2h-2Z" />
        <path fill="#cbb9c7" d="M14 28h2v-2h-2Z" />
        <path fill="#b59db1" d="M16 28h2v-2h-2Z" />
        <path fill="#a0819a" d="M18 28h2v-2h-2Z" />
        <path fill="#8b6584" d="M20 28h2v-2h-2Z" />
        <path fill="#715570" d="M22 28h2v-2h-2Z" />
        <path fill="#5b455c" d="M24 28h2v-2h-2Z" />
        <path fill="#453648" d="M26 28h2v-2h-2Z" />
        <path fill="#2e2634" d="M28 28h2v-2h-2Z" />
        <path fill="#221e2a" d="M30 28h2v-2h-2Z" />
        <path fill="#171721" d="M32 28h2v-2h-2Z" />
      </g>
      <g fillRule="evenodd">
        <path fill="#f7f2f5" d="M8 24h2v-2H8Z" />
        <path fill="#ece3e9" d="M10 24h2v-2h-2Z" />
        <path fill="#e1d5df" d="M12 24h2v-2h-2Z" />
        <path fill="#cbb9c7" d="M14 24h2v-2h-2Z" />
        <path fill="#b59db1" d="M16 24h2v-2h-2Z" />
        <path fill="#a0819a" d="M18 24h2v-2h-2Z" />
        <path fill="#8b6584" d="M20 24h2v-2h-2Z" />
        <path fill="#715570" d="M22 24h2v-2h-2Z" />
        <path fill="#5b455c" d="M24 24h2v-2h-2Z" />
        <path fill="#453648" d="M26 24h2v-2h-2Z" />
        <path fill="#2e2634" d="M28 24h2v-2h-2Z" />
        <path fill="#221e2a" d="M30 24h2v-2h-2Z" />
        <path fill="#171721" d="M32 24h2v-2h-2Z" />
      </g>
      <g fillRule="evenodd">
        <path fill="#f7f2f5" d="M8 20h2v-2H8Z" />
        <path fill="#ece3e9" d="M10 20h2v-2h-2Z" />
        <path fill="#e1d5df" d="M12 20h2v-2h-2Z" />
        <path fill="#cbb9c7" d="M14 20h2v-2h-2Z" />
        <path fill="#b59db1" d="M16 20h2v-2h-2Z" />
        <path fill="#a0819a" d="M18 20h2v-2h-2Z" />
        <path fill="#8b6584" d="M20 20h2v-2h-2Z" />
        <path fill="#715570" d="M22 20h2v-2h-2Z" />
        <path fill="#5b455c" d="M24 20h2v-2h-2Z" />
        <path fill="#453648" d="M26 20h2v-2h-2Z" />
        <path fill="#2e2634" d="M28 20h2v-2h-2Z" />
        <path fill="#221e2a" d="M30 20h2v-2h-2Z" />
        <path fill="#171721" d="M32 20h2v-2h-2Z" />
      </g>
      <g fillRule="evenodd">
        <path fill="#f7f2f5" d="M8 16h2v-2H8Z" />
        <path fill="#ece3e9" d="M10 16h2v-2h-2Z" />
        <path fill="#e1d5df" d="M12 16h2v-2h-2Z" />
        <path fill="#cbb9c7" d="M14 16h2v-2h-2Z" />
        <path fill="#b59db1" d="M16 16h2v-2h-2Z" />
        <path fill="#a0819a" d="M18 16h2v-2h-2Z" />
        <path fill="#8b6584" d="M20 16h2v-2h-2Z" />
        <path fill="#715570" d="M22 16h2v-2h-2Z" />
        <path fill="#5b455c" d="M24 16h2v-2h-2Z" />
        <path fill="#453648" d="M26 16h2v-2h-2Z" />
        <path fill="#2e2634" d="M28 16h2v-2h-2Z" />
        <path fill="#221e2a" d="M30 16h2v-2h-2Z" />
        <path fill="#171721" d="M32 16h2v-2h-2Z" />
      </g>
      <g fillRule="evenodd">
        <path fill="#f7f2f5" d="M8 12h2v-2H8Z" />
        <path fill="#ece3e9" d="M10 12h2v-2h-2Z" />
        <path fill="#e1d5df" d="M12 12h2v-2h-2Z" />
        <path fill="#cbb9c7" d="M14 12h2v-2h-2Z" />
        <path fill="#b59db1" d="M16 12h2v-2h-2Z" />
        <path fill="#a0819a" d="M18 12h2v-2h-2Z" />
        <path fill="#8b6584" d="M20 12h2v-2h-2Z" />
        <path fill="#715570" d="M22 12h2v-2h-2Z" />
        <path fill="#5b455c" d="M24 12h2v-2h-2Z" />
        <path fill="#453648" d="M26 12h2v-2h-2Z" />
        <path fill="#2e2634" d="M28 12h2v-2h-2Z" />
        <path fill="#221e2a" d="M30 12h2v-2h-2Z" />
        <path fill="#171721" d="M32 12h2v-2h-2Z" />
      </g>
    </svg>
  )
}

export default memo(PaletteIcon)
