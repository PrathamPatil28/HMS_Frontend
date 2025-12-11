import { useEffect, useState } from "react";
import axiosInstance from "../../../Interceptor/AxiosInterceptor.tsx";

// ✅ Define the expected response type from your backend
interface MediaResponse {
    id: string;
    url: string;
}

const useProtectedImage = (imageId: string | null | undefined): string => {
    // ✅ Default image if no imageId is provided
    const [imageUrl, setImageUrl] = useState<string>("/avtar.png");

    useEffect(() => {
        if (!imageId) return;

        const fetchImage = async () => {
            try {
                const response = await axiosInstance.get<MediaResponse>(`/media/${imageId}`);
                // 👇 Use the URL returned by the backend
                setImageUrl(response.data.url);
            } catch (error) {
                console.error("Error fetching image:", error);
                // ✅ Keep default avatar if error occurs
                setImageUrl("/avtar.png");
            }
        };

        fetchImage();
    }, [imageId]);

    return imageUrl;
};

export default useProtectedImage;
