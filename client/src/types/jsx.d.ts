import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any additional HTML attributes you need
    className?: string;
    // Add other common HTML attributes as needed
  }

  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    // Add other common SVG attributes as needed
  }

  // Add specific component props interfaces if needed
  interface IntrinsicElements {
    // Add any custom elements or override existing ones
    [elemName: string]: any;
  }
}

// Add global JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
