import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

export function AdUnit() {
  useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }, []);

  return (
    <section aria-label="Advertisement" className="w-full px-6 py-6 sm:px-10">
      <ins
        className="adsbygoogle mx-auto block w-full max-w-[970px]"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5041584446038467"
        data-ad-slot="5381600367"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </section>
  );
}
