export type FileCategory = "pdf" | "office" | "image" | "unsupported";
export function getFileCategory(rawUrl: string, mimeType: string): FileCategory {
    const m = mimeType.toLowerCase();
    const ext = rawUrl.split("?")[0].split(".").pop()?.toLowerCase() ?? "";

    if (m.includes("pdf") || ext === "pdf") return "pdf";
    if (
        ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext) ||
        m.includes("msword") ||
        m.includes("officedocument") ||
        m.includes("powerpoint") ||
        m.includes("excel")
    )
        return "office";
    if (m.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext))
        return "image";

    return "unsupported";
}