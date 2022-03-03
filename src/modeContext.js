import { createContext } from "react";

const modeContext = createContext({
  mode: "partenaire",
  setMode: (mode) => {},
});

export default modeContext;
