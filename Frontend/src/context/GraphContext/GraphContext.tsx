import type { DetailSteps, TableSteps } from "@/libs/Graph";
import type Graph from "@/libs/Graph";
import { createContext } from "react";

export interface GraphContextType {
  ping: string;
  isDirected: boolean;
  graph: React.MutableRefObject<Graph>;
  setPing: React.Dispatch<React.SetStateAction<string>>;
  setIsDirected: React.Dispatch<React.SetStateAction<boolean>>;
  nodeSize: number;
  setNodeSize: React.Dispatch<React.SetStateAction<number>>;
  edgeLength: number;
  setEdgeLength: React.Dispatch<React.SetStateAction<number>>;
  bgNodeColor: string;
  setBgNodeColor: React.Dispatch<React.SetStateAction<string>>;
  edgeColor: string;
  setEdgeColor: React.Dispatch<React.SetStateAction<string>>;
  labelColor: string;
  setLabelColor: React.Dispatch<React.SetStateAction<string>>;
  targetArrowColor: string;
  setTargetArrowColor: React.Dispatch<React.SetStateAction<string>>;
  info: {
    steps: number;
    detailSteps: DetailSteps[];
    tableSteps: TableSteps[];
    circuit: {
      id: string;
      label: string;
    }[];
  };
  setInfo: React.Dispatch<
    React.SetStateAction<{
      steps: number;
      detailSteps: DetailSteps[];
      tableSteps: TableSteps[];
      circuit: {
        id: string;
        label: string;
      }[];
    }>
  >;
  isEulerian: boolean | null;
  setIsEulerian: React.Dispatch<React.SetStateAction<boolean | null>>;
  hasEulerPath: boolean | null;
  setHasEulerPath: React.Dispatch<React.SetStateAction<boolean | null>>;
  connectedComponents: number;
  setConnectedComponents: React.Dispatch<React.SetStateAction<number>>;
}

export const GraphContext = createContext<GraphContextType | undefined>(
  undefined,
);
