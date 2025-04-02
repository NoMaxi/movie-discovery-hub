export const formatDuration = (totalMinutes: number): string => {
    if (!Number.isFinite(totalMinutes) || totalMinutes < 0) {
        return "";
    }

    if (totalMinutes === 0) {
        return "0min";
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    const parts = [hours > 0 && `${hours}h`, minutes > 0 && `${minutes}min`].filter(Boolean);

    return parts.join(" ");
};
