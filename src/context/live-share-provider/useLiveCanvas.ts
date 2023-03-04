import { LiveCanvas } from "@microsoft/live-share-canvas";
import { useEffect, useState } from "react";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { useLiveShareContext } from "./LiveShareProvider";

export const useLiveCanvas = (key: string | undefined): LiveCanvas | undefined => {
    const [liveCanvas, setLiveCanvas] = useState<LiveCanvas>();
    const { canvasMap } = useLiveShareContext();
    useEffect(() => {
        if (!canvasMap || !key) return;
        const handle = canvasMap.get<IFluidHandle<LiveCanvas>>(key);
        if (!handle) return;
        let mounted = true;
        const onGetDDS = async () => {
            try {
                const canvas = await handle.get();
                if (!mounted) return;
                setLiveCanvas(canvas);
            } catch (err: unknown) {
                console.error(err);
            }
        }
        onGetDDS();
        return () => {
            mounted = false;
        }
    }, [key, canvasMap]);

    return liveCanvas;
}
