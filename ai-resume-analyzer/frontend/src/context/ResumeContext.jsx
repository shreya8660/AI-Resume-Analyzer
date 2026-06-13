import { createContext, useContext, useReducer } from 'react';

const ResumeContext = createContext();

const initialState = {
  resumeId: null,
  fileName: null,
  fileType: null,
  textPreview: null,
  analyses: {
    ats: null,
    grammar: null,
    skills: null,
    improvements: null,
    jobMatch: null,
    rewrite: null,
    coverLetter: null,
    interview: null,
  },
  loading: {},
  errors: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_RESUME':
      return { ...initialState, ...action.payload };
    case 'SET_ANALYSIS':
      return {
        ...state,
        analyses: { ...state.analyses, [action.key]: action.data },
        loading: { ...state.loading, [action.key]: false },
        errors: { ...state.errors, [action.key]: null },
      };
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: action.value } };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.key]: action.error },
        loading: { ...state.loading, [action.key]: false },
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
