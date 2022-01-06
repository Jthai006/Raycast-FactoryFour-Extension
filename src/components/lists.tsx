import {
    ActionPanel,
    List,
    OpenInBrowserAction,
    useNavigation,
} from "@raycast/api";
import { SearchResult } from "..";
import TokenForm from "./tokenForm";

const SearchListItem = ({ searchResult }: { searchResult: SearchResult }) => {
    return (
        <List.Item
            title={`${searchResult.name} - ${searchResult.id}`}
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <OpenInBrowserAction title="Open in Browser" url={`https://dev-admin.factoryfour.com/internal#/?orgId=${searchResult.id}`} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

const ConfigListSection = ({ token, baseUrl }: ConfigListProps) => {
    const { push, pop } = useNavigation();

    return (
        <List.Section title="Config">
            <List.Item
                title="Token"
                subtitle={token}
                actions={
                    <ActionPanel>
                        <ActionPanel.Section>
                            <ActionPanel.Item title="Edit Token" onAction={() => push(<TokenForm isUnauthorized pop={pop} />)} />
                        </ActionPanel.Section>
                    </ActionPanel>
                }
            />
            <List.Item
                title="BaseUrl"
                subtitle={baseUrl}
                actions={
                    <ActionPanel>
                        <ActionPanel.Section>
                            <ActionPanel.Item title="Edit Token" onAction={() => push(<TokenForm isUnauthorized pop={pop} />)} />
                        </ActionPanel.Section>
                    </ActionPanel>
                }
            />
        </List.Section>
    )
}

interface ConfigListProps {
    token: string;
    baseUrl: string;
}

export {
    SearchListItem,
    ConfigListSection
}