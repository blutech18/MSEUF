import { useState, useCallback, useRef, useEffect } from "react";

export function useToast() {
  const [successMounted, setSuccessMounted] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  const [errorMounted, setErrorMounted] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const toastTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      toastTimers.current.forEach(clearTimeout);
    };
  }, []);

  const showSuccess = useCallback((msg: string) => {
    setSuccessMsg(msg);
    setSuccessMounted(true);
    const t1 = setTimeout(() => setSuccessVisible(true), 10);
    const t2 = setTimeout(() => setSuccessVisible(false), 4700);
    const t3 = setTimeout(() => { 
      setSuccessMounted(false); 
      setSuccessMsg(""); 
    }, 5200);
    toastTimers.current.push(t1, t2, t3);
  }, []);

  const showError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setErrorMounted(true);
    const t1 = setTimeout(() => setErrorVisible(true), 10);
    const t2 = setTimeout(() => setErrorVisible(false), 4700);
    const t3 = setTimeout(() => { 
      setErrorMounted(false); 
      setErrorMsg(""); 
    }, 5200);
    toastTimers.current.push(t1, t2, t3);
  }, []);

  return {
    showSuccess,
    showError,
    successToast: {
      mounted: successMounted,
      visible: successVisible,
      message: successMsg,
    },
    errorToast: {
      mounted: errorMounted,
      visible: errorVisible,
      message: errorMsg,
    },
  };
}
