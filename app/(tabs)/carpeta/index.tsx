import { useRouter, useLocalSearchParams } from "expo-router";
import CarpetaScreen from "@/src/features/carpetas";

export default function CarpetaRoute() {
    const router = useRouter();
    const params = useLocalSearchParams();

    return (
        <CarpetaScreen
            router={router}
            padreId={(params.padreId as string) ?? null}
            path={params.path ? JSON.parse(params.path as string) : []}
        />
    );
}
