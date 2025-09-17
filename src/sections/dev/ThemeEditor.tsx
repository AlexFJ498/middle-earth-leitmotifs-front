import { useEffect, useState } from 'react';

const TOKEN_KEYS = [
  'background',
  'foreground',
  'primary',
  'primary-foreground',
  'gold',
  'gold-soft',
  'leaf',
  'card-bg',
  'card-border',
  'chip-gradient-start',
  'chip-gradient-end'
];

interface TokenState { [k: string]: string }

function readToken(name: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
  return v || '';
}

export function ThemeEditor() {
  const [tokens, setTokens] = useState<TokenState>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial: TokenState = {};
    TOKEN_KEYS.forEach(k => { initial[k] = readToken(k); });
    setTokens(initial);
    setMounted(true);
  }, []);

  const update = (key: string, value: string) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
    setTokens(t => ({ ...t, [key]: value }));
  };

  const exportJSON = () => {
    const json = TOKEN_KEYS.reduce((acc, k) => {
      acc[`--color-${k}`] = tokens[k];
      return acc;
    }, {} as Record<string,string>);
    const pretty = JSON.stringify(json, null, 2);
    navigator.clipboard.writeText(pretty).catch(() => {});
    alert('Tokens copiados al portapapeles');
  };

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl bg-background/70 ring-1 ring-foreground/10 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Theme Editor</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {TOKEN_KEYS.map(key => {
          const val = tokens[key];
          const isColor = /^#|^rgb|^hsl/i.test(val);
          return (
            <label key={key} className="flex items-center gap-3 text-sm">
              <span className="w-40 font-medium">{key}</span>
              {isColor ? (
                <input
                  type="color"
                  value={val.startsWith('#') ? val : '#000000'}
                  onChange={e => update(key, e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-foreground/30 bg-background"
                />
              ) : null}
              <input
                type="text"
                value={val}
                onChange={e => update(key, e.target.value)}
                className="flex-1 rounded border border-foreground/20 bg-background/40 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-xs"
              />
            </label>
          );
        })}
      </div>
      <div className="flex gap-3">
        <button onClick={exportJSON} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold shadow hover:shadow-md transition">
          Copiar JSON
        </button>
        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold shadow hover:shadow-md transition">
          Reset (reload)
        </button>
      </div>
    </div>
  );
}
