import {
  ActionPanel,
  SubmitFormAction,
  setLocalStorageItem,
  Form,
  getLocalStorageItem,
  showToast,
  ToastStyle,
} from "@raycast/api";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

interface FormValues {
  token: string;
}

interface FormProps {
  isUnauthorized?: boolean;
  pop?: () => void
}

export default ({ isUnauthorized, pop }: FormProps) => {
  const [tokenValue, setTokenValue] = useState('');
  useEffect(() => {
    const setToken = async () => {
      const token = await getLocalStorageItem('f4Token');
      if (token && typeof token === 'string') {
        setTokenValue(token);
      }
    };
    setToken();
  }, []);

  const handleSubmit = ({ token }: FormValues) => {
    const decoded: Record<string, unknown> = jwt_decode(`${token}`);
    const baseUrl = (decoded.aud as string[])?.find((url: string) => url.includes('api')) || '';

    setLocalStorageItem('f4Token', token);
    setLocalStorageItem('f4BaseUrl', baseUrl);
    showToast(ToastStyle.Success, "Submitted form", "See logs for submitted values");
    if (isUnauthorized && pop) {
      pop();
    }
  }

  const onTokenChange = (token: string) => {
    setTokenValue(token);
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <SubmitFormAction title="Submit" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="token" title="Token" placeholder="Enter token" onChange={onTokenChange} value={tokenValue} />
    </Form>
  );
}
