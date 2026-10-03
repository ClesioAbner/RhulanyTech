import type { SVGProps } from 'react';

/*
 * Line icons, drawn on a 24px grid with the same 1.6 stroke as the cart.
 * Used sparingly: header actions, social links and contact channels.
 */
type IconProps = SVGProps<SVGSVGElement>;

const Line = ({ children, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const CartIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M2.75 3.75h2.1l2.4 10.6a1.6 1.6 0 0 0 1.56 1.25h7.86a1.6 1.6 0 0 0 1.55-1.2L20.25 7.5H5.7" />
    <circle cx="9.5" cy="19.5" r="1.25" />
    <circle cx="17" cy="19.5" r="1.25" />
  </Line>
);

export const WhatsAppIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M4.2 19.8l1.1-3.9A8.3 8.3 0 1 1 8.4 19l-4.2.8z" />
    <path d="M9.1 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .5-.1.6l-.5.6c-.1.1-.1.3 0 .5.3.6.8 1.2 1.3 1.6.4.4.9.7 1.4.9.2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.4.7c.2.1.3.3.3.5v.4c0 .4-.2.8-.6 1-.5.3-1.2.4-1.9.2-1.3-.4-2.5-1.1-3.5-2.1-.9-.9-1.6-2-2-3.2-.2-.7-.1-1.4.1-1.8z" />
  </Line>
);

export const FacebookIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a20 20 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8.8v3h2.6V21" />
  </Line>
);

export const InstagramIcon = (props: IconProps) => (
  <Line {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.8" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </Line>
);

export const PhoneIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M6.6 3.75h2.2l1.3 3.6-1.7 1.2a11 11 0 0 0 5.05 5.05l1.2-1.7 3.6 1.3v2.2a1.9 1.9 0 0 1-2.05 1.9A15.2 15.2 0 0 1 4.7 5.8a1.9 1.9 0 0 1 1.9-2.05z" />
  </Line>
);

export const MailIcon = (props: IconProps) => (
  <Line {...props}>
    <rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.5" />
    <path d="M4 7l8 6 8-6" />
  </Line>
);

export const StoreIcon = (props: IconProps) => (
  <Line {...props}>
    <path d="M12 21s-6.25-5.4-6.25-10.6a6.25 6.25 0 0 1 12.5 0C18.25 15.6 12 21 12 21z" />
    <circle cx="12" cy="10.25" r="2.25" />
  </Line>
);

export const ClockIcon = (props: IconProps) => (
  <Line {...props}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.5V12l3 2" />
  </Line>
);

export const SearchIcon = (props: IconProps) => (
  <Line {...props}>
    <circle cx="10.75" cy="10.75" r="6.25" />
    <path d="M15.5 15.5L20 20" />
  </Line>
);
