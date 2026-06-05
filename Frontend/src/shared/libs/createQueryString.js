export default function createQueryString(params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        // in our backend , null is treated different from undefined
        if (value === null) searchParams.append(key, "null");
        else if (value !== undefined && value !== "") searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : "";
}
