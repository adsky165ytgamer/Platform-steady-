export type ViewMode = 
  | 'home'
  | 'welcome'
  | 'layer-1'
  | 'lesson-1-1'
  | 'lesson-1-2'
  | 'lesson-1-3'
  | 'lesson-1-4'
  | 'lesson-1-5'
  | 'workbench-overview'
  | 'workbench-assets'
  | 'workbench-network'
  | 'workbench-plugins'
  | 'workbench-process'
  | 'workbench-sandbox'
  | 'workbench-ipc'
  | 'workbench-terminal'
  | 'workbench-storage';

export type WorkbenchTab =
  | 'overview'
  | 'assets'
  | 'network'
  | 'plugins'
  | 'process'
  | 'sandbox'
  | 'ipc'
  | 'terminal'
  | 'storage';

export type AppMode = 'workbench' | 'academy';

export interface Lesson {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  content: string[];
  keyTakeaway: string;
  focusConcepts: {
    term: string;
    explanation: string;
  }[];
}

export interface Layer {
  id: string;
  number: number;
  title: string;
  description: string;
  learningPoints: string[];
  lessons: Lesson[];
}

export interface Platform {
  id: string;
  name: string;
  subtitle: string;
  status: 'active' | 'upcoming';
  badgeText?: string;
  description: string;
}

// Workbench System Process Representation
export interface SimulatedProcess {
  pid: number;
  name: string;
  packageName: string;
  uid: number;
  userLabel: string;
  category: 'system' | 'foreground' | 'visible' | 'service' | 'cached';
  oomAdj: number; // -1000 (system) to 1000 (cached)
  ramMb: number;
  cpuPercent: number;
  state: 'R' | 'S' | 'D' | 'Z';
  selinuxContext: string;
  threads: number;
  pinned?: boolean;
}

// Sandbox App & Permissions
export interface SandboxApp {
  id: string;
  name: string;
  packageName: string;
  uid: number;
  selinuxDomain: string;
  privateDir: string;
  permissions: {
    name: string;
    description: string;
    granted: boolean;
    dangerous: boolean;
  }[];
  activeIsolationRules: string[];
}

// Binder IPC Transaction
export interface IpcTransaction {
  id: string;
  timestamp: string;
  clientProcess: string;
  clientPid: number;
  targetService: string;
  targetPid: number;
  interfaceName: string;
  method: string;
  flags: string[];
  payloadBytes: number;
  status: 'success' | 'security_denied' | 'dead_object' | 'in_flight';
  latencyMs: number;
}

// Virtual Storage Inode
export interface StorageNode {
  name: string;
  path: string;
  type: 'dir' | 'file' | 'device' | 'symlink';
  owner: string;
  group: string;
  permissions: string;
  size: string;
  selinuxLabel: string;
  children?: StorageNode[];
}
