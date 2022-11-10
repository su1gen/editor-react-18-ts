declare global {
    interface Window {
        jQuery: any;
        ATL_JQ_PAGE_PROPS: any;
    }
}
declare const loadJiraCollectorDialogScript: (labels: Array<string>, packageName: string, coreVersion: string, packageVersion: string, sessionId: string, contentId: string, tabId: string) => Promise<() => void>;
export default loadJiraCollectorDialogScript;
