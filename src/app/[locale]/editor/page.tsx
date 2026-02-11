
import { getComponents } from "@/actions/catalog";
import EditorClient from "@/components/editor/EditorClient";

export default async function EditorPage() {
    const components = await getComponents();
    return <EditorClient components={components} />;
}
