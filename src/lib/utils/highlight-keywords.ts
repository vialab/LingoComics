function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapes special characters
}

export function highlightKeywords(summary: string, keywords: Record<string, string>): string {
    let highlightedSummary = summary;
    const highlightClasses = ['highlight-1', 'highlight-2', 'highlight-3', 'highlight-4', 'highlight-5'];
    let colorIndex = 0;
    if (keywords) {
        Object.keys(keywords).forEach(keyword => {
            const escapedKeyword = escapeRegExp(keyword);
            const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
            const highlightClass = highlightClasses[colorIndex % highlightClasses.length];
            highlightedSummary = highlightedSummary.replace(regex, `<span class="highlight ${highlightClass}">$&</span>`);
            colorIndex += 1;
        });
    }
    return highlightedSummary;
}