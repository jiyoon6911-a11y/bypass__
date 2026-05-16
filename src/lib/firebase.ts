// Mock Firebase implementation
export const loginWithGoogle = async () => {
    return new Promise(resolve => setTimeout(resolve, 500));
};

export const logout = async () => {
    localStorage.removeItem('mockProfile');
    window.location.reload();
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error("Mock Firebase Error", error, operationType, path);
}
