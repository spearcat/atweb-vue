/// <reference types="react" />
import { LoadStyle, Thunk, Track, EqfPreset, WindowId } from "../types";
export declare function addTracksFromReferences(fileReferences: FileList, loadStyle: LoadStyle, atIndex: number | undefined): Thunk;
export declare function loadFilesFromReferences(fileReferences: FileList, loadStyle?: LoadStyle, atIndex?: number | undefined): Thunk;
export declare function setSkinFromBlob(blob: Blob | Promise<Blob>): Thunk;
export declare function setSkinFromUrl(url: string): Thunk;
export declare function openEqfFileDialog(): Thunk;
export declare function openMediaFileDialog(): Thunk;
export declare function openSkinFileDialog(): Thunk;
export declare function fetchMediaDuration(url: string, id: number): Thunk;
export declare function loadMedia(e: React.DragEvent<HTMLDivElement>, loadStyle?: LoadStyle, atIndex?: number): Thunk;
export declare function loadMediaFiles(tracks: Track[], loadStyle?: LoadStyle, atIndex?: number): Thunk;
export declare function loadMediaFile(track: Track, priority?: LoadStyle, atIndex?: number): Thunk;
export declare function fetchMediaTags(file: string | Blob, id: number): Thunk;
export declare function setEqFromFileReference(fileReference: File): Thunk;
export declare function setEqFromObject(preset: EqfPreset): Thunk;
export declare function downloadPreset(): Thunk;
export declare function downloadHtmlPlaylist(): Thunk;
export declare function addFilesAtIndex(nextIndex: number): Thunk;
export declare function addDirAtIndex(nextIndex: number): Thunk;
export declare function addFilesFromUrl(atIndex?: number): Thunk;
export declare function addFilesFromList(): Thunk;
export declare function saveFilesToList(): Thunk;
export declare function droppedFiles(e: React.DragEvent, windowId: WindowId): Thunk;
