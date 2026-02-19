import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary pageName={Component.name || 'Page'}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
