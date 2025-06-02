// pages/_app.tsx
import type { AppProps } from "next/app";
import "@/app_new/globals.css"; // Make sure this path matches your styles folder

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}