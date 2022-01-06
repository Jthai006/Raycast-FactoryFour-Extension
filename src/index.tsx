import {
  List,
  showToast,
  ToastStyle,
  getLocalStorageItem,
  useNavigation,
} from "@raycast/api";
import { useState, useEffect, ReactNode } from "react";
import fetch from "node-fetch";
import Form from './components/tokenForm';
import { ConfigListSection, SearchListItem } from "./components/lists";

export default () => {
  const { push, pop } = useNavigation();
  const { state, search } = useSearch({ push, pop });

  return (
    <List isLoading={state.isLoading} onSearchTextChange={search} searchBarPlaceholder="Search by name..." throttle>
      <ConfigListSection token={state.token} baseUrl={state.baseUrl} />
      <List.Section title="Results" subtitle={state.results.length + ""}>
        {state.filteredResults.map((searchResult) => (
          <SearchListItem key={searchResult.id} searchResult={searchResult} />
        ))}
      </List.Section>
    </List>
  );
}

const useSearch = ({ push, pop }: UseSearchProps) => {
  const [state, setState] = useState<SearchState>({ results: [], isLoading: true, filteredResults: [], token: '', baseUrl: '' });

  useEffect(() => {
    search("");
    const setOrgs = async () => {
      try {
        const token = await getLocalStorageItem("f4Token") || ''
        const baseUrl = await getLocalStorageItem("f4BaseUrl") || ''
        setState((oldState) => ({
          ...oldState,
          isLoading: true,
          token: `${token}`,
          baseUrl: `${baseUrl}`
        }));
        const results = await getOrgs(`${token}`, `${baseUrl}`);
        setState((oldState) => ({
          ...oldState,
          results: results,
          filteredResults: results,
          isLoading: false,
        }));
      }
      catch (error) {
        if (error === 'Unauthorized') {
          push(<Form isUnauthorized pop={pop} />)
        }
        console.error("search error", error);
        showToast(ToastStyle.Failure, "Could not retireve results", String(error));
      }
    }
    setOrgs();
  }, []);

  const search = async (searchText: string) => {
    try {
      const filteredResults = state.results.filter(({ name, id }) => {
        return name.toLowerCase().includes(searchText.toLowerCase())
          || `${id}`.includes(searchText)
      });
      setState((oldState) => ({
        ...oldState,
        filteredResults,
        isLoading: false,
      }));
    } catch (error) {
      console.error("search error", error);
      showToast(ToastStyle.Failure, "Could not perform search", String(error));
    }
  }

  return {
    state: state,
    search: search,
  };
}

const getOrgs = async (token: string, baseUrl: string): Promise<SearchResult[]> => {
  const response = await fetch(`${baseUrl}/accounts/organizations`, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  const json = (await response.json()) as Json;
  const { organizations } = (json?.data as { organizations: any[] }) ?? { organizations: [] };
  return organizations.map((organization) => {
    return {
      id: organization.id,
      name: organization.name as string,
    };
  });
}

interface SearchState {
  results: SearchResult[];
  filteredResults: SearchResult[];
  isLoading: boolean;
  token: string;
  baseUrl: string;
}

export interface SearchResult {
  id: string;
  name: string;
}

interface UseSearchProps {
  push: (component: ReactNode) => void;
  pop: () => void;
}

type Json = Record<string, unknown>;