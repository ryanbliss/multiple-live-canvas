import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { ContainerSchema, IFluidContainer, SharedMap } from "fluid-framework";
import { AzureContainerServices } from "@fluidframework/azure-client";
import { LoadableRenderer } from "../../components";
import { inTeams, isErrorLike, isLiveState, isSharedMap } from "../../utils";
import { LiveShareHost } from "@microsoft/teams-js";
import {
  LiveShareClient,
  TestLiveShareHost,
  LiveState,
} from "@microsoft/live-share";
import { LiveCanvas } from "@microsoft/live-share-canvas";

interface ILiveShareProviderProps {
  children: ReactNode;
}

/**
 * Live Share Context Provider
 */
export const LiveShareProvider: FC<ILiveShareProviderProps> = (props) => {
  const { children } = props;
  const { canvasMap, liveSelectedCanvas, error, results } =
    useLiveShareObjects();
  const canvasKeys = useLiveCanvasKeys(canvasMap);
  const selectedCanvasKey = useSelectedCanvasKey(liveSelectedCanvas);
  return (
    <LiveShareContext.Provider
      value={{
        loading: !canvasMap,
        error,
        canvasMap,
        canvasKeys,
        selectedCanvasKey,
        liveSelectedCanvas,
        container: results?.container,
      }}
    >
      <LoadableRenderer loading={!canvasMap} error={error}>
        {children}
      </LoadableRenderer>
    </LiveShareContext.Provider>
  );
};

interface ILiveShareContext {
  loading: boolean;
  error: Error | undefined;
  canvasMap: SharedMap | undefined;
  selectedCanvasKey: string | undefined;
  liveSelectedCanvas: LiveState | undefined;
  canvasKeys: string[];
  container: IFluidContainer | undefined;
}

/**
 * Uses context provided by LiveShareContext wrapper
 */
export const useLiveShareContext = (): ILiveShareContext =>
  useContext(LiveShareContext);

/**
 * Get Live Share container
 * @returns
 */
const useLiveShareObjects = () => {
  const loadingRef = useRef(false);
  const [results, setResults] = useState<{
    container: IFluidContainer;
    services: AzureContainerServices;
    created: boolean;
  }>();
  const [error, setError] = useState<Error>();
  const canvasMap = isSharedMap(results?.container.initialObjects.canvasMap)
    ? results?.container.initialObjects.canvasMap
    : undefined;
  const liveSelectedCanvas = isLiveState(
    results?.container.initialObjects.liveSelectedCanvas
  )
    ? results?.container.initialObjects.liveSelectedCanvas
    : undefined;

  // Join the container
  useEffect(() => {
    if (loadingRef.current) return;
    let mounted = true;
    const join = async () => {
      try {
        const host = inTeams()
          ? LiveShareHost.create()
          : TestLiveShareHost.create();
        const client = new LiveShareClient(host);
        const schema: ContainerSchema = {
          initialObjects: {
            canvasMap: SharedMap,
            liveSelectedCanvas: LiveState,
          },
          dynamicObjectTypes: [LiveCanvas],
        };
        const results = await client.joinContainer(schema);
        if (!mounted) return;
        setResults(results);
      } catch (err: unknown) {
        if (!mounted) return;
        if (isErrorLike(err)) {
          setError(new Error(err.message));
          return;
        }
        setError(new Error("Unable to join container"));
      }
    };
    join();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    results,
    canvasMap,
    liveSelectedCanvas,
    error,
  };
};

// Get the list of live canvas keys
const useLiveCanvasKeys = (canvasMap: SharedMap | undefined): string[] => {
  const [keys, setKeys] = useState<string[]>([]);
  useEffect(() => {
    if (!canvasMap) return;
    let mounted = true;
    const onValueChanged = () => {
      if (!mounted) return;
      setKeys(Array.from(canvasMap.keys()));
    };
    canvasMap.on("valueChanged", onValueChanged);
    if (canvasMap.size > 0) {
      onValueChanged();
    }
    return () => {
      mounted = false;
      canvasMap?.off("valueChanged", onValueChanged);
    };
  }, [canvasMap]);
  return keys;
};

// Get the currently selected live canvas
const useSelectedCanvasKey = (
  liveSelectedCanvas: LiveState | undefined
): string | undefined => {
  const [key, setKey] = useState<string>();
  useEffect(() => {
    if (!liveSelectedCanvas) return;
    let mounted = true;
    const onStateChanged = () => {
      if (!mounted) return;
      console.log("state changed", liveSelectedCanvas.state);
      setKey(liveSelectedCanvas.state);
    };
    liveSelectedCanvas.on("stateChanged", onStateChanged);
    const initialize = async () => {
      await liveSelectedCanvas.initialize();
      if (liveSelectedCanvas.state) {
        onStateChanged();
      }
      console.log("initialized", liveSelectedCanvas.state);
    };
    if (!liveSelectedCanvas.isInitialized) {
      initialize();
    }
    return () => {
      mounted = false;
      liveSelectedCanvas?.off("stateChanged", onStateChanged);
    };
  }, [liveSelectedCanvas]);
  return key;
};

const LiveShareContext = createContext<ILiveShareContext>(
  {} as ILiveShareContext
);
