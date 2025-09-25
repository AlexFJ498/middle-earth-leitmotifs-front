import React from 'react';

interface IconProps extends Readonly<React.SVGProps<SVGSVGElement>> {
  readonly size?: number;
}

export function EmailIcon({ size = 18, className, ...rest }: IconProps): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      {...rest}
    >
      <path d="M2 5.75A2.75 2.75 0 0 1 4.75 3h14.5A2.75 2.75 0 0 1 22 5.75v12.5A2.75 2.75 0 0 1 19.25 21H4.75A2.75 2.75 0 0 1 2 18.25V5.75Zm2.3-.25 7.2 5.4 7.2-5.4H4.3ZM4 7.3v10.95c0 .414.336.75.75.75h14.5a.75.75 0 0 0 .75-.75V7.3l-7.55 5.66a1 1 0 0 1-1.2 0L4 7.3Z" />
    </svg>
  );
}
