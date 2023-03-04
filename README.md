# TypeScript: Multiple Live Share Canvas DDS's

This sample shows how to dynamically load `LiveCanvas` instances, so that you can store a list of drawings in your Fluid container.

## How it works

This project uses React Context, which allows us to have lightweight centralized app state. This is where we handle the core business logic of our application, but you can do this part in any way you like.

The first important file is our [LiveShareProvider](./src/context/live-share-provider/LiveShareProvider.tsx) file, which sets up our Fluid objects. When this provider is loaded in our DOM, it will automatically join the Live Share session and exposes relevant state from the container's Fluid objects through the `useLiveShareContext` hook. Relevant state from this hook includes:

- `canvasMap`: a `SharedMap` which stores references to our `LiveCanvas` DDS handles.
- `canvasKeys`: a stateful list of key strings (the DDS unique ID) from `canvasMap`, which are set automatically within `LiveShareProvider`.
- `liveSelectedCanvas`: a `LiveState` instance that tracks the selected key for which `LiveCanvas` instance is currently being viewed in the session.
- `selectedCanvasKey`: the stateful string that denotes the currently selected canvas key from `liveSelectedCanvas`, which is set automatically within `LiveShareProvider`.

There are also a couple of convenience hooks that use values from `useLiveShareContext`, including:

- [useCreateNewLiveCanvas](./src/context/live-share-provider/useCreateNewLiveCanvas.ts): dynamically creates a new `LiveCanvas` instance and sets a reference to its handle within `canvasMap`.
- [useLiveCanvas](./src/context/live-share-provider/useLiveCanvas): for a provided `canvasKey` string, this hook returns a stateful `LiveCanvas` instance from within `canvasMap`.

These values and hooks are then used within the following components from within [MeetingStagePage](./src/pages/MeetingStagePage.tsx):

- [LiveCanvasList](./src/components/live-canvas-list/LiveCanvasList.tsx): a button to create a new `LiveCanvas` instance, and a list of [LiveCanvasListItem](./src/components/live-canvas-list/LiveCanvasListItem.tsx)s for each key in `canvasKeys`.
- [LiveCanvasListItem](./src/components/live-canvas-list/LiveCanvasListItem.tsx): Uses `useLiveCanvas` to setup an `InkingManager`, which is then used to render the `LiveCanvas` strokes in a small preview card. When clicking on the card, it sets its key to `liveSelectedCanvas`.
- [LiveCanvasEditor](./src/components/live-canvas-editor/LiveCanvasEditor.tsx): for the current `selectedCanvasKey`, this component uses `useLiveCanvas` to setup an `InkingManager`, which is then used for end-user editing of the drawing.

## Gaps & considerations

Overall, this workflow works pretty well. However, there are a few gaps & considerations that this project uncovered.

Because each `LiveCanvas` object only supports working with a single `InkingManager`, and `InkingManager` a single `div`, I had to initialize one instance for `LiveCanvasListItem` and another for `LiveCanvasEditor`. This mostly works, but unfortunately there are issues with live updates of strokes. In particular, strokes that the local user makes to the `LiveCanvasEditor` are not reflected in `LiveCanvasListItem` until re-initializing `LiveCanvas` and `InkingManager`. In this sample, I do this whenever `selectedCanvasKey` changes, but this is quite inefficient. Because edits by non-local users are still reflected, this causes the drawing to look incorrect. There are probably ways this could be solved in the user interface, such as by hiding the preview while it is selected (e.g., "Currently editing" with blank background).

This also brings some other performance considerations. Rather than having two separate `LiveCanvas` and `InkingManager` instances, technically it would be more efficient to have one `LiveCanvas` and `InkingManager` that supports multiple `<div>` elements. This would ensure that the optimal amount of re-draws & stroke processing is handled for both, and could even include separate re-draw optimizations for the preview element that are handled differently than the main editor. Today, this is not possible and will require feature enhancements to `InkingManager`.

## Testing Locally in Browser

In the project directory, you can run:

### `npm install`

Installs the latest node packages

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

Note: `npm run build:dev` builds the project in dev mode.

### `npm run start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
Upon loading, if there is no `/#{id}` in the URL, it will create one and insert it into the URL.\
You can copy this URL and paste it into new browser tabs to test Live Share using a local server.\
To test the side panel & video queue, you can replace your URL with `/sidepanel#{id}`.

**Note:** if testing with HTTPS, such as when using a tunneling service like Ngrok, instead use the command `npm run start-https`.
