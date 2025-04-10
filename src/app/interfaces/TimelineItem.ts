export interface TimelineItem {
    icon: string;
    color: string;
    title: string;
    time: string;
    extraInfo?: string;
    extra?: { subtitle?: string; badge?: string; warning?: string };

}