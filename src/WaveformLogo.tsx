import { useId } from 'react';

// Original waveform geometry supplied by the portfolio owner. A mask keeps the
// cutouts transparent, so the logo follows the card's changing hover surface.
const waveformCutout = 'M100 80H0V42H1V18H0V0H100V80ZM10 34V57H11V34H10ZM34 34V57H35V34H34ZM68 34V57H69V34H68ZM92 34V57H93V34H92ZM52 15V51H53V15H52ZM22 34V50H23V34H22ZM46 34V50H47V34H46ZM80 34V50H81V34H80ZM98 34V50H99V34H98ZM4 25V48H5V25H4ZM8 34V48H9V34H8ZM16 25V48H17V25H16ZM20 34V48H21V34H20ZM28 25V48H29V25H28ZM32 34V48H33V34H32ZM40 25V48H41V25H40ZM44 34V48H45V34H44ZM50 34V48H51V34H50ZM62 25V48H63V25H62ZM66 34V48H67V34H66ZM74 25V48H75V25H74ZM78 34V48H79V34H78ZM86 25V48H87V25H86ZM90 34V48H91V34H90ZM96 34V48H97V34H96ZM6 27V44H7V27H6ZM18 27V44H19V27H18ZM30 27V44H31V27H30ZM42 27V44H43V27H42ZM48 27V44H49V27H48ZM64 27V44H65V27H64ZM76 27V44H77V27H76ZM88 27V44H89V27H88ZM94 27V44H95V27H94ZM12 28V42H13V28H12ZM24 18V42H25V18H24ZM36 28V42H37V28H36ZM54 31V42H55V31H54ZM58 18V42H59V18H58ZM70 28V42H71V28H70ZM82 18V42H83V18H82ZM2 25V39H3V25H2ZM14 25V39H15V25H14ZM26 25V39H27V25H26ZM38 25V39H39V25H38ZM56 29V39H57V29H56ZM60 25V39H61V25H60ZM72 25V39H73V25H72ZM84 25V39H85V25H84Z';

export default function WaveformLogo() {
  const maskId = `waveform-${useId().replace(/:/g, '')}`;
  return (
    <svg className="thumbnail waveform-logo" viewBox="0 0 100 80" aria-hidden="true" focusable="false">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="80">
          <rect width="100" height="80" fill="white" />
          <path d={waveformCutout} fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect y="8" width="100" height="59" fill="#aaaba9" />
        <g className="waveform-fill"><rect x="-96" y="9" width="105" height="56" fill="var(--accent)" /></g>
      </g>
      <g className="waveform-scanner" fill="var(--accent)">
        <rect y="4" width="1" height="72" />
        <path d="M0.5 77L2.2321 80H-1.2321L0.5 77ZM0.5 3L2.2321 0H-1.2321L0.5 3Z" />
      </g>
    </svg>
  );
}
