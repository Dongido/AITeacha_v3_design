import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
  Dispatch,
} from "react";

// Define the state interface
interface State {
  openSidenav: boolean;
  sidenavColor: string;
  sidenavType: string;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
}

// Define action types
interface Action {
  type:
    | "OPEN_SIDENAV"
    | "SIDENAV_TYPE"
    | "SIDENAV_COLOR"
    | "TRANSPARENT_NAVBAR"
    | "FIXED_NAVBAR"
    | "OPEN_CONFIGURATOR";
  value: any;
}

// Define context type with an object structure for clarity
interface MaterialTailwindContextType {
  controller: State;
  dispatch: Dispatch<Action>;
}

// Initial state
const initialState: State = {
  openSidenav: false,
  sidenavColor: "dark",
  sidenavType: "white",
  transparentNavbar: true,
  fixedNavbar: true,
  openConfigurator: false,
};

// Create the context
export const MaterialTailwind =
  createContext<MaterialTailwindContextType | null>(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

// Reducer function to handle state changes
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_SIDENAV":
      return { ...state, openSidenav: action.value };
    case "SIDENAV_TYPE":
      return { ...state, sidenavType: action.value };
    case "SIDENAV_COLOR":
      return { ...state, sidenavColor: action.value };
    case "TRANSPARENT_NAVBAR":
      return { ...state, transparentNavbar: action.value };
    case "FIXED_NAVBAR":
      return { ...state, fixedNavbar: action.value };
    case "OPEN_CONFIGURATOR":
      return { ...state, openConfigurator: action.value };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Context provider props
interface MaterialTailwindControllerProviderProps {
  children: React.ReactNode;
}

// Context provider component
export function MaterialTailwindControllerProvider({
  children,
}: MaterialTailwindControllerProviderProps) {
  const [controller, dispatch] = useReducer(reducer, initialState);

  // Pass `controller` and `dispatch` as an object for clarity
  const value = useMemo(
    () => ({ controller, dispatch }),
    [controller, dispatch]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

// Custom hook with debugging log
export function useMaterialTailwindController(): MaterialTailwindContextType {
  const context = useContext(MaterialTailwind);
  if (!context) {
    console.error("MaterialTailwindControllerProvider is missing.");
    throw new Error(
      "useMaterialTailwindController must be used within MaterialTailwindControllerProvider."
    );
  }
  return context;
}

// Export action creators
export const setOpenSidenav = (dispatch: Dispatch<Action>, value: boolean) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch: Dispatch<Action>, value: string) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch: Dispatch<Action>, value: string) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (
  dispatch: Dispatch<Action>,
  value: boolean
) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch: Dispatch<Action>, value: boolean) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (
  dispatch: Dispatch<Action>,
  value: boolean
) => dispatch({ type: "OPEN_CONFIGURATOR", value });
