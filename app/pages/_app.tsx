import "@/css/global/Global.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default App;
